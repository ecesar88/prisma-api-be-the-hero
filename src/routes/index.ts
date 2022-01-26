import express from "express";

import ROUTES from "../constants/routes";
import IncidentController from "../controllers/IncidentController";
import OngController from "../controllers/OngController";

const router = express.Router();

/* /ongs */
router.route(ROUTES.ONGS).post(OngController.create).get(OngController.get);

/* /incidents */
router
  .route(ROUTES.INCIDENTS)
  .post(IncidentController.create)
  .get(IncidentController.get)
  .put(IncidentController.update)
  .delete(IncidentController.delete);

export default router;
