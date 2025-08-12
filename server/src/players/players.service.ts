import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerInput, UpdatePlayerInput } from './dto/player.input';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async createPlayer(data: CreatePlayerInput) {
    return this.prisma.player.create({
      data,
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.player.findMany({
      include: {
        user: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.player.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async updatePlayer(id: string, data: UpdatePlayerInput) {
    return this.prisma.player.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  async deletePlayer(id: string) {
    return this.prisma.player.delete({
      where: { id },
    });
  }

  // Estadísticas del jugador
  async getPlayerStats(playerId: string) {
    const stats = await this.prisma.playerStats.findMany({
      where: { playerId },
      include: {
        match: true,
      },
    });

    const totalGoals = stats.reduce((sum, stat) => sum + stat.goals, 0);
    const totalAssists = stats.reduce((sum, stat) => sum + stat.assists, 0);
    const totalMatches = stats.length;

    return {
      playerId,
      totalGoals,
      totalAssists,
      totalMatches,
      matchStats: stats,
    };
  }
}
