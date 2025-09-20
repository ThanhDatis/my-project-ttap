/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axios';

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
  totalEmployees: number;
}

export interface RecentOrder {
  id: string;
  orderId: string;
  customerName: string;
  createdAt: string;
  paymentMethod: string;
  total: number;
  status: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

// type ApiEnvelope<T> = {
//   success: boolean;
//   message?: string;
//   data?: T;
//   stats?: T;
//   recentOrders?: T;
//   lowStockProducts?: T;
// };

class DashboardRepository {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [customersRes, ordersRes, productsRes, employeesRes] =
        await Promise.all([
          axiosInstance.get('/customers', { params: { limit: 1 } }),
          axiosInstance.get('/orders', { params: { limit: 1 } }),
          axiosInstance.get('/products', { params: { limit: 1 } }),
          axiosInstance.get('/employees', { params: { limit: 1 } }),
        ]);

      const pendingOrdersRes = await axiosInstance.get('/orders', {
        params: { status: 'pending', limit: 1 },
      });

      const allOrdersRes = await axiosInstance.get('/orders', {
        params: { limit: 1000 },
      });

      const totalRevenue = Array.isArray(allOrdersRes.data?.items)
        ? allOrdersRes.data.items.reduce(
            (sum: number, order: any) => sum + (order.total || 0),
            0,
          )
        : 0;

      return {
        totalCustomers: customersRes.data?.total || 0,
        totalOrders: ordersRes.data?.total || 0,
        totalProducts: productsRes.data?.data?.pagination?.total || 0,
        pendingOrders: pendingOrdersRes.data?.total || 0,
        totalRevenue,
        totalEmployees: employeesRes.data?.total || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  async getRecentOrders(limit: number = 10): Promise<RecentOrder[]> {
    try {
      const res = await axiosInstance.get('/orders', {
        params: {
          limit,
          sort: 'createdAt:desc',
        },
      });

      const orders = res.data?.items || [];
      return orders.map((order: any) => ({
        id: order.id,
        orderId: order.orderId,
        customerName: order.customerName,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        total: order.total,
        status: order.status,
      }));
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw new Error('Failed to fetch recent orders');
    }
  }

  async getLowStockProducts(
    threshold: number = 5,
    limit: number = 10,
  ): Promise<LowStockProduct[]> {
    try {
      const res = await axiosInstance.get('/products', {
        params: {
          limit: 100,
          sort: 'stock:asc',
        },
      });

      const products = res.data?.data?.items || [];

      const lowStockProducts = products
        .filter(
          (product: any) => product.stock <= threshold && product.stock >= 0,
        )
        .slice(0, limit)
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          sku: product.sku || '',
          stock: product.stock,
          category: product.category,
        }));

      return lowStockProducts;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw new Error('Failed to fetch low stock products');
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const [stats, recentOrders, lowStockProducts] = await Promise.all([
        this.getDashboardStats(),
        this.getRecentOrders(10),
        this.getLowStockProducts(5, 10),
      ]);

      return {
        stats,
        recentOrders,
        lowStockProducts,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
}

export const dashboardRepository = new DashboardRepository();
export default dashboardRepository;
