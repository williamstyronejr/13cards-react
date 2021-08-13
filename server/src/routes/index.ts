import path from 'path';
import { Application } from 'express';

/**
 * Sets up all routes for to be used for app.
 * @param {Object} app Express application
 */
export default function setupRoutes(app: Application) {
  app.use('/*', (req, res, next) => {
    try {
      res.sendFile(
        path.join(__dirname, '..', '..', '..', 'client', 'build', 'index.html'),
      );
    } catch (err) {
      next({
        status: 404,
        message: 'Client production build could not be found.',
      });
    }
  });
}
