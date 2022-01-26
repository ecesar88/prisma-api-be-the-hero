import Ajv, { JSONSchemaType } from "ajv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import HttpStatusCode from "../constants/HttpStatusCode";
import Ong from "../models/Ong";
import OngService from "../services/OngService";
import { createdView, errorView, successView } from "../views";

class OngController {
  async create(req: Request, res: Response) {
    const { name, email, whatsapp, city, uf, password } = req.body;

    const ongSchema: Ong = {
      name,
      email,
      whatsapp,
      city,
      uf,
      password,
    };

    const ajv = new Ajv();

    const schema: JSONSchemaType<Ong> = {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        whatsapp: { type: "string" },
        city: { type: "string" },
        uf: { type: "string" },
        password: { type: "string" },
      },
      required: ["name", "email", "whatsapp", "city", "uf", "password"],
      additionalProperties: false,
    };

    const validate = ajv.validate(schema, ongSchema);

    if (!validate) {
      const response = errorView(
        {
          message: "Invalid values",
          errors: ajv.errors,
        },
        HttpStatusCode.BAD_REQUEST
      );

      return res.status(HttpStatusCode.BAD_REQUEST).json(response);
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const ong = new Ong(name, email, whatsapp, city, uf, hashedPassword);

      const ongId = await OngService.create(ong);

      const response = createdView({
        ongId,
        message: "Ong criada com sucesso",
      });

      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (err) {
      console.log(err);

      const response = errorView({ error: String(err) });
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  async get(_req: Request, res: Response) {
    try {
      const ongs = await OngService.get();

      const response = successView(ongs, ongs.length);

      return res.status(HttpStatusCode.OK).json(response);
    } catch (err) {
      console.log(err);

      const response = errorView({ error: String(err) });
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }
}

export default new OngController();
