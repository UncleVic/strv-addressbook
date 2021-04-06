import * as express from 'express';
import { AddrBookController } from '../controllers/addrBook.controller';

export class AddrBookRouter {
  public static getRoutes(): express.Router {
    const router = express.Router();
    router.route('/addrbooks/:user/contacts').post(async (req: express.Request, res: express.Response) => {
      const user = req.params.user;
      const addrBookController = new AddrBookController();
      const result = await addrBookController.createContact(user, req.body);
      if (result.errors && result.errors.length) {
        res.status(result.errors[0].status).json(result);
      } else {
        res.status(201).json(result);
      }
    });
    return router;
  }
}
