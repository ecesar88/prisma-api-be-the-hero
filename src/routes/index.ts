import express from "express";

import ROUTES from "../constants/routes";
import AuthController from "../controllers/AuthController";
import IncidentController from "../controllers/IncidentController";
import OngController from "../controllers/OngController";

const router = express.Router();

router.route(ROUTES.LOGIN).post(AuthController.login);

/* /ongs */
router.route(ROUTES.ONGS).post(OngController.create).get(OngController.get);

/* /incidents */
router
  .route(ROUTES.INCIDENTS)
  .post(IncidentController.create)
  .get(IncidentController.findAll)
  .put(IncidentController.update)
  .delete(IncidentController.delete);

export default router;
