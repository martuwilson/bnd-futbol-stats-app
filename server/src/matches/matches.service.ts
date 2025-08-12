import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateMatchInput, 
  UpdateMatchInput, 
  AddPlayerToMatchInput, 
  UpdatePlayerStatsInput 
} from './dto/match.input';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async createMatch(data: CreateMatchInput) {
    return this.prisma.match.create({
      data: {
        ...data,
        date: new Date(data.date),
        team1Name: data.team1Name || 'Equipo 1',
        team2Name: data.team2Name || 'Equipo 2',
      },
      include: {
        user: true,
        matchPlayers: {
          include: {
            user: true,
          },
        },
        playerStats: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.match.findMany({
      include: {
        user: true,
        matchPlayers: {
          include: {
            user: true,
          },
        },
        playerStats: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.match.findMany({
      where: { userId },
      include: {
        user: true,
        matchPlayers: {
          include: {
            user: true,
          },
        },
        playerStats: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.match.findUnique({
      where: { id },
      include: {
        user: true,
        matchPlayers: {
          include: {
            user: true,
          },
        },
        playerStats: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateMatch(id: string, data: UpdateMatchInput) {
    const updateData: any = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return this.prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        matchPlayers: {
          include: {
            user: true,
          },
        },
        playerStats: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async deleteMatch(id: string) {
    return this.prisma.match.delete({
      where: { id },
    });
  }

  async addPlayerToMatch(matchId: string, data: AddPlayerToMatchInput) {
    // Verificar que el jugador no esté ya en el partido
    const existingPlayer = await this.prisma.matchPlayer.findUnique({
      where: {
        userId_matchId: {
          userId: data.userId,
          matchId: matchId,
        },
      },
    });

    if (existingPlayer) {
      throw new Error('El jugador ya está asignado a este partido');
    }

    // Agregar jugador al partido
    await this.prisma.matchPlayer.create({
      data: {
        userId: data.userId,
        matchId: matchId,
        team: data.team,
      },
    });

    // Crear estadísticas iniciales para el jugador
    await this.prisma.playerStats.create({
      data: {
        userId: data.userId,
        matchId: matchId,
      },
    });

    return this.findOne(matchId);
  }

  async removePlayerFromMatch(matchId: string, userId: string) {
    // Eliminar estadísticas del jugador
    await this.prisma.playerStats.deleteMany({
      where: {
        userId: userId,
        matchId: matchId,
      },
    });

    // Eliminar jugador del partido
    await this.prisma.matchPlayer.deleteMany({
      where: {
        userId: userId,
        matchId: matchId,
      },
    });

    return this.findOne(matchId);
  }

  async updatePlayerStats(matchId: string, data: UpdatePlayerStatsInput) {
    return this.prisma.playerStats.upsert({
      where: {
        userId_matchId: {
          userId: data.userId,
          matchId: matchId,
        },
      },
      update: {
        goals: data.goals,
        assists: data.assists,
        yellowCards: data.yellowCards,
        redCards: data.redCards,
      },
      create: {
        userId: data.userId,
        matchId: matchId,
        goals: data.goals || 0,
        assists: data.assists || 0,
        yellowCards: data.yellowCards || 0,
        redCards: data.redCards || 0,
      },
    });
  }

  // Estadísticas generales
  async getTopScorers(limit: number = 10) {
    const result = await this.prisma.playerStats.groupBy({
      by: ['userId'],
      _sum: {
        goals: true,
      },
      orderBy: {
        _sum: {
          goals: 'desc',
        },
      },
      take: limit,
    });

    // Obtener información de los jugadores
    const playersWithStats = await Promise.all(
      result.map(async (stat) => {
        const user = await this.prisma.user.findUnique({
          where: { id: stat.userId },
        });
        return {
          user,
          totalGoals: stat._sum?.goals || 0,
        };
      }),
    );

    return playersWithStats;
  }

  async getTopAssists(limit: number = 10) {
    const result = await this.prisma.playerStats.groupBy({
      by: ['userId'],
      _sum: {
        assists: true,
      },
      orderBy: {
        _sum: {
          assists: 'desc',
        },
      },
      take: limit,
    });

    const playersWithStats = await Promise.all(
      result.map(async (stat) => {
        const user = await this.prisma.user.findUnique({
          where: { id: stat.userId },
        });
        return {
          user,
          totalAssists: stat._sum?.assists || 0,
        };
      }),
    );

    return playersWithStats;
  }
}
