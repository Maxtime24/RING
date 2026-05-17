import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    code: err.code || 'server_error',
    message: err.message || 'Internal server error',
    details: err.details || null,
  });
};
