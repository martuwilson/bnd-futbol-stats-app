import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  StatisticsFilterInput, 
  PlayerComparisonInput, 
  MatchAnalysisInput, 
  RankingInput 
} from './dto/statistics.input';
import { 
  PlayerStatistics, 
  MatchStatistics, 
  SeasonStatistics, 
  PositionStatistics, 
  ComparisonStatistics 
} from './entities/statistics.entity';
import { Position } from '../users/entities/user.entity';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  // Estadísticas individuales de un jugador
  async getPlayerStatistics(userId: string, filter?: StatisticsFilterInput): Promise<PlayerStatistics> {
    const whereClause: any = {
      userId: userId,
    };

    // Aplicar filtros de fecha si se proporcionan
    if (filter?.startDate || filter?.endDate) {
      whereClause.match = {
        date: {},
      };
      if (filter.startDate) {
        whereClause.match.date.gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        whereClause.match.date.lte = new Date(filter.endDate);
      }
    }

    // Obtener estadísticas agregadas
    const stats = await this.prisma.playerStats.aggregate({
      where: whereClause,
      _sum: {
        goals: true,
        assists: true,
        yellowCards: true,
        redCards: true,
      },
      _count: {
        id: true,
      },
    });

    // Obtener información del usuario
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const totalMatches = stats._count.id;
    const totalGoals = stats._sum.goals || 0;
    const totalAssists = stats._sum.assists || 0;
    const totalYellowCards = stats._sum.yellowCards || 0;
    const totalRedCards = stats._sum.redCards || 0;

    // Calcular métricas derivadas
    const goalsPerMatch = totalMatches > 0 ? totalGoals / totalMatches : 0;
    const assistsPerMatch = totalMatches > 0 ? totalAssists / totalMatches : 0;
    
    // Rating de efectividad: fórmula personalizada
    const effectivenessRating = this.calculateEffectivenessRating(
      totalGoals, 
      totalAssists, 
      totalMatches, 
      totalYellowCards, 
      totalRedCards
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname || undefined,
        role: user.role as any, // Conversión temporal para compatibilidad de tipos
        position: user.position as any, // Conversión temporal para compatibilidad de tipos
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      totalMatches,
      totalGoals,
      totalAssists,
      totalYellowCards,
      totalRedCards,
      goalsPerMatch: Math.round(goalsPerMatch * 100) / 100,
      assistsPerMatch: Math.round(assistsPerMatch * 100) / 100,
      effectivenessRating: Math.round(effectivenessRating * 100) / 100,
    };
  }

  // Ranking de jugadores por categoría
  async getRanking(input: RankingInput): Promise<PlayerStatistics[]> {
    const limit = input.limit || 10;
    
    const whereClause: any = {};
    
    // Filtro por posición
    if (input.position) {
      whereClause.user = {
        position: input.position as Position,
      };
    }

    // Filtro por fechas
    if (input.startDate || input.endDate) {
      whereClause.match = {
        date: {},
      };
      if (input.startDate) {
        whereClause.match.date.gte = new Date(input.startDate);
      }
      if (input.endDate) {
        whereClause.match.date.lte = new Date(input.endDate);
      }
    }

    // Determinar el campo de ordenamiento según la categoría
    let orderByField: string;
    let sumField: string;
    
    switch (input.category) {
      case 'goals':
        orderByField = 'goals';
        sumField = 'goals';
        break;
      case 'assists':
        orderByField = 'assists';
        sumField = 'assists';
        break;
      case 'matches':
        // Para partidos jugados, necesitamos contar registros únicos
        return this.getRankingByMatches(whereClause, limit);
      case 'effectiveness':
        // Para efectividad, necesitamos cálculo personalizado
        return this.getRankingByEffectiveness(whereClause, limit);
      default:
        orderByField = 'goals';
        sumField = 'goals';
    }

    // Obtener estadísticas agrupadas por usuario
    const result = await this.prisma.playerStats.groupBy({
      by: ['userId'],
      where: whereClause,
      _sum: {
        goals: true,
        assists: true,
        yellowCards: true,
        redCards: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          [sumField]: 'desc',
        },
      },
      take: limit,
    });

    // Convertir a PlayerStatistics
    const playerStats = await Promise.all(
      result.map(async (stat) => {
        const user = await this.prisma.user.findUnique({
          where: { id: stat.userId },
        });

        if (!user) return null;

        const totalMatches = stat._count.id;
        const totalGoals = stat._sum.goals || 0;
        const totalAssists = stat._sum.assists || 0;
        const totalYellowCards = stat._sum.yellowCards || 0;
        const totalRedCards = stat._sum.redCards || 0;

        return {
          user,
          totalMatches,
          totalGoals,
          totalAssists,
          totalYellowCards,
          totalRedCards,
          goalsPerMatch: totalMatches > 0 ? Math.round((totalGoals / totalMatches) * 100) / 100 : 0,
          assistsPerMatch: totalMatches > 0 ? Math.round((totalAssists / totalMatches) * 100) / 100 : 0,
          effectivenessRating: Math.round(this.calculateEffectivenessRating(
            totalGoals, 
            totalAssists, 
            totalMatches, 
            totalYellowCards, 
            totalRedCards
          ) * 100) / 100,
        };
      })
    );

    return playerStats.filter(stat => stat !== null) as PlayerStatistics[];
  }

  // Análisis de un partido específico
  async getMatchAnalysis(input: MatchAnalysisInput): Promise<MatchStatistics> {
    const match = await this.prisma.match.findUnique({
      where: { id: input.matchId },
      include: {
        playerStats: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!match) {
      throw new Error('Partido no encontrado');
    }

    // Calcular estadísticas del partido
    const totalGoals = match.playerStats.reduce((sum, stat) => sum + stat.goals, 0);
    const totalAssists = match.playerStats.reduce((sum, stat) => sum + stat.assists, 0);
    const totalCards = match.playerStats.reduce(
      (sum, stat) => sum + stat.yellowCards + stat.redCards, 
      0
    );

    // Determinar MVP (jugador con mejor rendimiento)
    let mvp: any = undefined;
    let highestScore = -1;

    for (const stat of match.playerStats) {
      const score = this.calculateMatchScore(stat.goals, stat.assists, stat.yellowCards, stat.redCards);
      if (score > highestScore) {
        highestScore = score;
        mvp = {
          id: stat.user.id,
          email: stat.user.email,
          name: stat.user.name,
          nickname: stat.user.nickname || undefined,
          role: stat.user.role as any,
          position: stat.user.position as any,
          isActive: stat.user.isActive,
          createdAt: stat.user.createdAt,
          updatedAt: stat.user.updatedAt,
        };
      }
    }

    return {
      matchId: match.id,
      date: match.date,
      team1Name: match.team1Name,
      team2Name: match.team2Name,
      team1Goals: match.team1Goals,
      team2Goals: match.team2Goals,
      totalGoals,
      totalAssists,
      totalCards,
      mvp,
    };
  }

  // Comparación entre dos jugadores
  async comparePlayersStatistics(input: PlayerComparisonInput): Promise<ComparisonStatistics> {
    const filter: StatisticsFilterInput = {
      startDate: input.startDate,
      endDate: input.endDate,
    };

    const user1Stats = await this.getPlayerStatistics(input.userId1, filter);
    const user2Stats = await this.getPlayerStatistics(input.userId2, filter);

    // Determinar ganador basado en rating de efectividad
    let winner = 'tie';
    const scoreDifference = Math.abs(user1Stats.effectivenessRating - user2Stats.effectivenessRating);
    
    if (user1Stats.effectivenessRating > user2Stats.effectivenessRating) {
      winner = 'user1';
    } else if (user2Stats.effectivenessRating > user1Stats.effectivenessRating) {
      winner = 'user2';
    }

    return {
      user1: user1Stats.user,
      user2: user2Stats.user,
      user1Stats,
      user2Stats,
      winner,
      scoreDifference: Math.round(scoreDifference * 100) / 100,
    };
  }

  // Estadísticas de temporada/general
  async getSeasonStatistics(filter?: StatisticsFilterInput): Promise<SeasonStatistics> {
    const whereClause: any = {};
    
    if (filter?.startDate || filter?.endDate) {
      whereClause.match = {
        date: {},
      };
      if (filter.startDate) {
        whereClause.match.date.gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        whereClause.match.date.lte = new Date(filter.endDate);
      }
    }

    // Estadísticas generales
    const generalStats = await this.prisma.playerStats.aggregate({
      where: whereClause,
      _sum: {
        goals: true,
        assists: true,
      },
      _count: {
        id: true,
      },
    });

    const totalMatches = await this.prisma.match.count({
      where: filter?.startDate || filter?.endDate ? {
        date: {
          ...(filter.startDate && { gte: new Date(filter.startDate) }),
          ...(filter.endDate && { lte: new Date(filter.endDate) }),
        },
      } : undefined,
    });

    const totalGoals = generalStats._sum.goals || 0;
    const totalAssists = generalStats._sum.assists || 0;

    // Top performers
    const rankingInput: RankingInput = {
      category: 'goals',
      limit: 5,
      startDate: filter?.startDate,
      endDate: filter?.endDate,
    };

    const topScorers = await this.getRanking(rankingInput);
    
    const assistsRanking: RankingInput = { ...rankingInput, category: 'assists' };
    const topAssists = await this.getRanking(assistsRanking);
    
    const effectivenessRanking: RankingInput = { ...rankingInput, category: 'effectiveness' };
    const mostEffective = await this.getRanking(effectivenessRanking);

    return {
      totalMatches,
      totalGoals,
      totalAssists,
      averageGoalsPerMatch: totalMatches > 0 ? Math.round((totalGoals / totalMatches) * 100) / 100 : 0,
      averageAssistsPerMatch: totalMatches > 0 ? Math.round((totalAssists / totalMatches) * 100) / 100 : 0,
      topScorers,
      topAssists,
      mostEffective,
    };
  }

  // Estadísticas por posición
  async getPositionStatistics(filter?: StatisticsFilterInput): Promise<PositionStatistics[]> {
    const positions = ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'];
    
    const result = await Promise.all(
      positions.map(async (position) => {
        const ranking = await this.getRanking({
          category: 'goals',
          position: position,
          limit: 3,
          startDate: filter?.startDate,
          endDate: filter?.endDate,
        });

        // Calcular promedios para la posición
        const positionStats = await this.prisma.playerStats.aggregate({
          where: {
            user: {
              position: position as Position,
            },
            ...(filter?.startDate || filter?.endDate ? {
              match: {
                date: {
                  ...(filter.startDate && { gte: new Date(filter.startDate) }),
                  ...(filter.endDate && { lte: new Date(filter.endDate) }),
                },
              },
            } : {}),
          },
          _avg: {
            goals: true,
            assists: true,
          },
          _count: {
            userId: true,
          },
        });

        return {
          position,
          playerCount: positionStats._count.userId,
          averageGoals: Math.round((positionStats._avg.goals || 0) * 100) / 100,
          averageAssists: Math.round((positionStats._avg.assists || 0) * 100) / 100,
          topPerformers: ranking,
        };
      })
    );

    return result.filter(stat => stat.playerCount > 0);
  }

  // Métodos auxiliares privados
  private calculateEffectivenessRating(
    goals: number, 
    assists: number, 
    matches: number, 
    yellowCards: number, 
    redCards: number
  ): number {
    if (matches === 0) return 0;
    
    // Fórmula de rating personalizada
    const baseScore = (goals * 3) + (assists * 2);
    const penaltyScore = (yellowCards * 0.5) + (redCards * 2);
    const matchBonus = matches * 0.1;
    
    const rating = ((baseScore - penaltyScore + matchBonus) / matches) * 10;
    return Math.max(0, rating); // No permitir ratings negativos
  }

  private calculateMatchScore(goals: number, assists: number, yellowCards: number, redCards: number): number {
    return (goals * 3) + (assists * 2) - (yellowCards * 0.5) - (redCards * 2);
  }

  private async getRankingByMatches(whereClause: any, limit: number): Promise<PlayerStatistics[]> {
    const result = await this.prisma.playerStats.groupBy({
      by: ['userId'],
      where: whereClause,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    const playerStats = await Promise.all(
      result.map(async (stat) => {
        return this.getPlayerStatistics(stat.userId);
      })
    );

    return playerStats;
  }

  private async getRankingByEffectiveness(whereClause: any, limit: number): Promise<PlayerStatistics[]> {
    // Para efectividad, necesitamos obtener todas las estadísticas y calcular manualmente
    const allPlayers = await this.prisma.playerStats.groupBy({
      by: ['userId'],
      where: whereClause,
      _sum: {
        goals: true,
        assists: true,
        yellowCards: true,
        redCards: true,
      },
      _count: {
        id: true,
      },
    });

    const playersWithEffectiveness = await Promise.all(
      allPlayers.map(async (stat) => {
        const playerStats = await this.getPlayerStatistics(stat.userId);
        return playerStats;
      })
    );

    // Ordenar por effectivenessRating y tomar los primeros
    return playersWithEffectiveness
      .sort((a, b) => b.effectivenessRating - a.effectivenessRating)
      .slice(0, limit);
  }
}
