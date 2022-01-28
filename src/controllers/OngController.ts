import Ajv, { JSONSchemaType } from "ajv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import HttpStatusCode from "../constants/HttpStatusCode";
import Ong from "../models/Ong";
import OngService from "../services/OngService";
import { createdView, errorView, successView } from "../views";
import { extractAjvErrors } from "../util";

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

    const validate = ajv.validate(schema, ongSchema);

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

    // Checar se o email passado já existe
    const emailExistente = await OngService.findOne("email", email);

    if (emailExistente) {
      const response = errorView(
        {
          message:
            "Este email já está sendo utilizado, por favor, cadastre outro",
        },
        HttpStatusCode.CONFLICT
      );

      return res.status(HttpStatusCode.CONFLICT).json(response);
    }

    try {
      // Hashear senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Criar novo objeto de Ong
      const ong = new Ong(name, email, whatsapp, city, uf, hashedPassword);

      // Criar no banco
      await OngService.create(ong);

      // Criar objeto de resposta
      const response = createdView({
        message: "Ong criada com sucesso",
      });

      // Enviar resposta
      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (err) {
      console.log(err);

      // Deu erro na hora de criar no banco, criando objeto
      // de resposta e enviando-a
      const response = errorView({ error: String(err) });
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  async get(_req: Request, res: Response) {
    try {
      const ongs = await OngService.findAll();

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
