import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateCallUpInput, 
  UpdateCallUpInput, 
  JoinCallUpInput 
} from './dto/call-up.input';

@Injectable()
export class CallUpsService {
  constructor(private prisma: PrismaService) {}

  async createCallUp(data: CreateCallUpInput) {
    return this.prisma.callUp.create({
      data: {
        ...data,
        matchDate: new Date(data.matchDate),
      },
      include: {
        createdBy: true,
        responses: {
          include: {
            user: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.callUp.findMany({
      include: {
        createdBy: true,
        responses: {
          include: {
            user: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        matchDate: 'desc',
      },
    });
  }

  async findActive() {
    return this.prisma.callUp.findMany({
      where: { 
        isOpen: true,
        matchDate: {
          gte: new Date(), // Solo convocatorias futuras
        },
      },
      include: {
        createdBy: true,
        responses: {
          include: {
            user: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        matchDate: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.callUp.findUnique({
      where: { id },
      include: {
        createdBy: true,
        responses: {
          include: {
            user: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  async updateCallUp(id: string, data: UpdateCallUpInput) {
    const updateData: any = { ...data };
    if (data.matchDate) {
      updateData.matchDate = new Date(data.matchDate);
    }

    return this.prisma.callUp.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: true,
        responses: {
          include: {
            user: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }

  async deleteCallUp(id: string) {
    return this.prisma.callUp.delete({
      where: { id },
    });
  }

  async joinCallUp(data: JoinCallUpInput) {
    // Verificar que la convocatoria esté abierta
    const callUp = await this.prisma.callUp.findUnique({
      where: { id: data.callUpId },
      include: {
        responses: true,
      },
    });

    if (!callUp) {
      throw new Error('Convocatoria no encontrada');
    }

    if (!callUp.isOpen) {
      throw new Error('La convocatoria está cerrada');
    }

    // Verificar si el usuario ya se apuntó
    const existingResponse = await this.prisma.callUpResponse.findUnique({
      where: {
        callUpId_userId: {
          callUpId: data.callUpId,
          userId: data.userId,
        },
      },
    });

    if (existingResponse) {
      throw new Error('Ya te apuntaste a esta convocatoria');
    }

    // Verificar límite de jugadores
    if (callUp.maxPlayers && callUp.responses.length >= callUp.maxPlayers) {
      throw new Error('La convocatoria está completa');
    }

    // Calcular la siguiente posición
    const nextPosition = callUp.responses.length + 1;

    // Crear la respuesta
    await this.prisma.callUpResponse.create({
      data: {
        callUpId: data.callUpId,
        userId: data.userId,
        position: nextPosition,
        message: data.message,
      },
    });

    return this.findOne(data.callUpId);
  }

  async leaveCallUp(callUpId: string, userId: string) {
    // Encontrar la respuesta del usuario
    const response = await this.prisma.callUpResponse.findUnique({
      where: {
        callUpId_userId: {
          callUpId: callUpId,
          userId: userId,
        },
      },
    });

    if (!response) {
      throw new Error('No estás apuntado a esta convocatoria');
    }

    // Eliminar la respuesta
    await this.prisma.callUpResponse.delete({
      where: { id: response.id },
    });

    // Reordenar las posiciones de los que quedan
    await this.prisma.callUpResponse.updateMany({
      where: {
        callUpId: callUpId,
        position: {
          gt: response.position,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });

    return this.findOne(callUpId);
  }

  async closeCallUp(id: string) {
    return this.prisma.callUp.update({
      where: { id },
      data: { isOpen: false },
      include: {
        createdBy: true,
        responses: {
          include: {
            user: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }
}
