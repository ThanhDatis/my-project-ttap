import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import React from 'react';

import { brand } from '../../common/color';
import theme from '../../common/theme/themes';
import CustomTable from '../../components/tables/customTable';
import { type Employee } from '../../lib/employee.repo';

import EmployeeDetailDialog from './components/employeesDetailDialog';
import EmployeeFilters from './components/employeesFilter';
import EmployeeForm from './components/employeesForm';
import useEmployees from './hooks/useEmployees';

const Employees: React.FC = () => {
  const {
    employees,
    total,
    page,
    limit,
    selectedEmployee,
    employeeToDelete,

    isLoading,
    // isDeleting,
    formMode,
    showDetail,
    showDeleteDialog,

    anchorEl,

    columns,

    handleConfirmDelete,
    handleRefresh,
    handlePageChange,

    handleMenuClose,
    handleMenuEdit,
    handleMenuDelete,
    handleMenuView,

    handleCloseForm,
    handleCloseDetail,
    handleCloseDeleteDialog,
    handleEditFromDetail,
    handleDeleteFromDetail,

    search,
    role,
    status,
    sort,
    handleSearchChange,
    handleRoleChange,
    handleStatusChange,
    handleSortChange,
    handleSortModelChange,
  } = useEmployees();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading && (!employees || employees.length === 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          flexDirection: 'column',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading employees...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant={isMobile ? 'h6' : 'h3'}
          sx={{ fontWeight: 'bold', mb: 1, letterSpacing: 1 }}
        >
          EMPLOYEE MANAGEMENT
        </Typography>
      </Box>

      <EmployeeForm
        mode={formMode}
        employee={selectedEmployee ?? undefined}
        // isCreating={isCreating}
        isTableLoading={isLoading}
        onRefresh={handleRefresh}
        onClose={handleCloseForm}
        // onUpdateSubmit={handleUpdateEmployeeSubmit}
        // onCreateSubmit={handleCreateEmployeeSubmit}
      />

      <EmployeeFilters
        search={search}
        role={role}
        status={status}
        sort={sort}
        totalCount={total}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
      />

      <Box
        sx={{
          flex: 1,
          px: { xs: 1, md: 2 },
          width: '100%',
          maxWidth: '100vw',
          overflow: 'hidden',
          pb: 2,
        }}
      >
        <CustomTable<Employee>
          rowHeight={isMobile ? 60 : 90}
          columnHeaders={columns}
          isLoading={isLoading}
          checkboxSelection
          items={employees}
          totalCount={total}
          currentPage={page - 1}
          maxPageSize={limit}
          onPageChange={handlePageChange}
          handleSortModelChange={handleSortModelChange}
          onRowClick={(params) => {
            console.log('Row clicked:', params.row);
          }}
          noDataMessage="No employees found. Start by adding your first employee."
          sx={{
            width: '100%',
            height: '100%',
            '& .MuiDataGrid-root': {
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              },
              '& .MuiDataGrid-cell': {
                fontSize: isMobile ? '0.75rem' : '0.875rem',
              },
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'action.hover' },
            },
            ...(isMobile && {
              '& .MuiDataGrid-virtualScroller': { overflow: 'auto !important' },
            }),
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            minWidth: 150,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            ...(!isMobile && { minWidth: 120 }),
          },
        }}
      >
        <MenuItem onClick={handleMenuView}>
          <ListItemIcon>
            <VisibilityRoundedIcon
              fontSize="small"
              sx={{ color: brand[500] }}
            />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuEdit}>
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuDelete}>
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <EmployeeDetailDialog
        open={showDetail}
        onClose={handleCloseDetail}
        employee={selectedEmployee}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      <Dialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { ...(isMobile && { margin: 0, borderRadius: 0 }) } }}
      >
        <DialogTitle id="delete-dialog-title">Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete employee "{employeeToDelete?.name}"?
            This action cannot be undone.
            {employeeToDelete && (
              <Box
                component="span"
                sx={{ display: 'block', mt: 1, color: 'warning.main' }}
              >
                ⚠️ This will permanently remove all employee data and access
                permissions.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={isLoading}
            fullWidth={isMobile}
            variant={isMobile ? 'text' : 'outlined'}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isLoading}
            autoFocus={isMobile}
            fullWidth={isMobile}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;
