import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // Si no hay roles requeridos, permitir acceso
    }

    // Obtener el contexto GraphQL
    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();
    
    // Buscar userId en los argumentos
    let userId: string | null = null;
    
    // Buscar en argumentos directos
    if (args.userId) {
      userId = args.userId;
    }
    // Buscar en input/data objects
    else if (args.data?.userId) {
      userId = args.data.userId;
    }
    else if (args.input?.userId) {
      userId = args.input.userId;
    }
    // Para mutations de crear usuario, el usuario está en el data
    else if (args.data?.id) {
      userId = args.data.id;
    }

    if (!userId) {
      // Si no se proporciona userId, denegar acceso para operaciones que requieren roles
      return false;
    }

    try {
      // Verificar si el usuario existe y obtener su rol
      const user = await this.usersService.findOne(userId);
      if (!user) {
        return false;
      }

      // Verificar si el rol del usuario está en los roles requeridos
      return requiredRoles.some((role) => user.role === role);
    } catch (error) {
      return false;
    }
  }
}
