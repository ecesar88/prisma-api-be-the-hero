import { prisma } from "@prisma/client";
import prismaClient from "../database/prismaClient";

import Incident from "../models/Incident";

class IncidentService {
  async create(incident: Incident) {
    const Incident = await prismaClient.incidents.create({
      data: {
        ...incident,
      },
    });

    return Incident.id;
  }

  async get(ong_Id: string) {
    return await prismaClient.incidents.findMany({
      where: {
        ongId: {
          equals: ong_Id,
        },
      },
    });
  }

  async getOne(incidentId: string) {
    return await prismaClient.incidents.findFirst({
      where: {
        id: {
          equals: parseInt(incidentId),
        },
      },
    });
  }

  async delete(incidentId: string) {
    return await prismaClient.incidents.delete({
      where: {
        id: parseInt(incidentId),
      },
    });
  }

  async update(incidentId: string, data: Partial<Incident>) {
    return await prismaClient.incidents.update({
      where: {
        id: parseInt(incidentId),
      },
      data: {
        ...data,
      },
    });
  }
}

export default new IncidentService();
