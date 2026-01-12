/**
 * Standardized error handling middleware
 * Ensures all errors are returned in a consistent format
 */

export const errorHandler = (err, req, res, next) => {
  // Default error structure
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  } else if (err.name === 'CastError') {
    // Invalid MongoDB ObjectId
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate entry - this resource already exists';
  }

  // Log error for debugging (in production, use proper logging)
  if (statusCode === 500) {
    console.error('Server Error:', err);
  }

  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
