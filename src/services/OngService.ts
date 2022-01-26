import prismaClient from "../database/prismaClient";
import Ong from "../models/Ong";

class OngService {
  async create(ong: Ong) {
    const Ong = await prismaClient.ong.create({
      data: {
        ...ong,
      },
    });

    return Ong.id;
  }

  async get() {
    return await prismaClient.ong.findMany({
      select: {
        name: true,
        email: true,
        whatsapp: true,
        city: true,
        uf: true,
        incidents: {
          select: {
            id: true,
            title: true,
            description: true,
            value: true,
          },
        },
      },
    });
  }
}

export default new OngService();
