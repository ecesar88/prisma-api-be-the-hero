import { Request, Response } from "express";
import Ajv, { JSONSchemaType } from "ajv";

import HttpStatusCode from "../constants/HttpStatusCode";
import Incident from "../models/Incident";
import IncidentService from "../services/IncidentService";
import { createdView, errorView, successView } from "../views";
import { extractAjvErrors } from "../util";

const ajv = new Ajv();

const schema: JSONSchemaType<Incident> = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    value: { type: "string" },
    ongId: { type: "string" },
  },
  required: ["description", "title", "value", "ongId"],
  additionalProperties: false,
};

class IncidentController {
  async create(req: Request, res: Response) {
    const { title, description, value } = req.body;
    const ongId = req.headers.authorization;

    const incidentSchema = {
      title,
      description,
      value,
      ongId,
    };

    const validate = ajv.validate(schema, incidentSchema);

    if (!validate) {
      const response = errorView(
        {
          message: ajv.errorsText(ajv.errors),
          errors: extractAjvErrors(ajv.errors),
        },
        HttpStatusCode.BAD_REQUEST
      );

      return res.status(HttpStatusCode.BAD_REQUEST).json(response);
    }

    try {
      const incident = new Incident(title, description, value, ongId!);

      const incidentId = await IncidentService.create(incident);

      const response = createdView({
        incidentId,
        message: "Incidente criado com sucesso",
      });

      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (err) {
      console.log(err);

      const response = errorView({ error: String(err) });
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  async findAll(req: Request, res: Response) {
    const ongId = req.headers.authorization;

    if (!ongId) {
      const response = errorView(
        {
          error: "Invalid authorization/ongId",
        },
        HttpStatusCode.BAD_REQUEST
      );

      return res.status(HttpStatusCode.BAD_REQUEST).json(response);
    }

    try {
      const incidents = await IncidentService.findAll(ongId);

      const response = successView(incidents, incidents.length);

      return res.status(HttpStatusCode.OK).json(response);
    } catch (err) {
      console.log(err);

      const response = errorView({ error: String(err) });
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  async delete(req: Request, res: Response) {
    const incidentId = req.params.incidentId;

    if (!incidentId) {
      const response = errorView(
        {
          error: "Incident ID is required",
        },
        HttpStatusCode.BAD_REQUEST
      );

      return res.status(HttpStatusCode.BAD_REQUEST).json(response);
    }

    const ongId = req.headers.authorization;
    const incident = await IncidentService.findOne(incidentId);

    if (!incident) {
      const response = errorView(
        { error: "Incident not found" },
        HttpStatusCode.NOT_FOUND
      );

      return res.status(HttpStatusCode.NOT_FOUND).json(response);
    }

    if (incident?.ongId !== ongId) {
      const response = errorView(
        { error: "Unauthorized" },
        HttpStatusCode.UNAUTHORIZED
      );

      return res.status(HttpStatusCode.UNAUTHORIZED).json(response);
    }

    try {
      await IncidentService.delete(incidentId);

      return res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (err) {
      console.log(err);

      const response = errorView({ error: String(err) });
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  async update(req: Request, res: Response) {
    const incidentId = req.params.incidentId;
    const data: Partial<Incident> = req.body;
    delete data.ongId;

    const incidentSchema: Partial<Incident> = {
      title: data.title,
      description: data.description,
      value: data.value,
    };

    const validate = ajv.validate(schema, incidentSchema);

    if (!validate) {
      const response = errorView(
        {
          message: ajv.errorsText(ajv.errors),
          errors: extractAjvErrors(ajv.errors),
        },
        HttpStatusCode.BAD_REQUEST
      );

      return res.status(HttpStatusCode.BAD_REQUEST).json(response);
    }

    if (!incidentId) {
      const response = errorView(
        {
          error: "Incident ID is required",
        },
        HttpStatusCode.BAD_REQUEST
      );

      return res.status(HttpStatusCode.BAD_REQUEST).json(response);
    }

    const ongId = req.headers.authorization;
    const incident = await IncidentService.findOne(incidentId);

    if (!incident) {
      const response = errorView(
        { error: "Incident not found" },
        HttpStatusCode.NOT_FOUND
      );

      return res.status(HttpStatusCode.NOT_FOUND).json(response);
    }

    if (incident?.ongId !== ongId) {
      const response = errorView(
        { error: "Unauthorized" },
        HttpStatusCode.UNAUTHORIZED
      );

      return res.status(HttpStatusCode.UNAUTHORIZED).json(response);
    }

    try {
      await IncidentService.update(incidentId, data);

      return res.status(HttpStatusCode.OK).send();
    } catch (error) {
      console.log(error);

      const response = errorView({ error: String(error) });
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }
}

export default new IncidentController();
