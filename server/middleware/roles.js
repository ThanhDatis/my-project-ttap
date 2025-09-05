const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role === 'admin' || role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden' });
};

export { requireAdmin };
