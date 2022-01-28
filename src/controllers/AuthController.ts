import Ajv, { JSONSchemaType } from "ajv";
import bcrypt from "bcrypt";

import { Request, Response } from "express";
import HttpStatusCode from "../constants/HttpStatusCode";
import OngService from "../services/OngService";
import { extractAjvErrors } from "../util";
import { errorView, successView } from "../views";

const ajv = new Ajv();

const schema: JSONSchemaType<{ email: string; password: string }> = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

class AuthController {
  async login(req: Request, res: Response) {
    console.log(this);
    const { email, password } = req.body;

    const validate = ajv.validate(schema, { email, password });

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

    const ong = await OngService.findOne("email", email);

    // Verifica se existe
    if (!ong) {
      const response = errorView(
        {
          message: "Este email não está cadastrado",
        },
        HttpStatusCode.NOT_FOUND
      );

      return res.status(HttpStatusCode.NOT_FOUND).json(response);
    }

    const isPasswordCorrect = await bcrypt.compare(password, ong.password);

    if (!isPasswordCorrect) {
      const response = errorView(
        {
          message: "Senha incorreta",
        },
        HttpStatusCode.UNAUTHORIZED
      );

      return res.status(HttpStatusCode.UNAUTHORIZED).json(response);
    }

    const response = successView({
      ongId: ong.id,
    });

    return res.status(HttpStatusCode.OK).json(response);
  }
}

export default new AuthController();
