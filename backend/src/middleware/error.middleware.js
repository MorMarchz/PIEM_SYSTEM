// 404 Not Found Route Handler
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error_code: 'ROUTE_NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler Log]:', err);

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error_code: errorCode,
    message: err.message || 'An internal server error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
