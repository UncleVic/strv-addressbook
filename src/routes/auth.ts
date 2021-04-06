import * as express from 'express';
import { UserController } from '../controllers/user.controller';

export class AuthRouter {
  public static getRoutes(): express.Router {
    // const log = getLog();
    const router = express.Router();

    router.route('/signup').post(async (req: express.Request, res: express.Response) => {
      const userController = new UserController();
      const result = await userController.createUser(req.body);
      if (result.errors && result.errors.length) {
        res.status(result.errors[0].status).json(result);
      } else {
        res.status(201).json(result);
      }
    });

    router.route('/login').post(async (req: express.Request, res: express.Response) => {
      const userController = new UserController();
      const result = await userController.loginUser(req.body);
      if (result.errors && result.errors.length) {
        res.status(result.errors[0].status).json(result);
      } else {
        res.status(200).json(result);
      }
    });

    return router;
  }
}
