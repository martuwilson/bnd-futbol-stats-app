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
    const request = ctx.getContext().req;
    const args = ctx.getArgs();
    
    let userId: string | null = null;
    let userRole: UserRole | null = null;

    // Método 1: Usuario autenticado via JWT (preferido)
    if (request.user) {
      userId = request.user.id;
      userRole = request.user.role;
    }
    // Método 2: Header personalizado (fallback para testing)
    else if (request.headers['x-user-id']) {
      userId = request.headers['x-user-id'];
    }
    // Método 3: Buscar en argumentos (fallback adicional)
    else {
      if (args.userId) {
        userId = args.userId;
      } else if (args.data?.userId) {
        userId = args.data.userId;
      } else if (args.input?.userId) {
        userId = args.input.userId;
      } else if (args.data?.id) {
        userId = args.data.id;
      }
    }

    if (!userId) {
      return false; // No se puede identificar al usuario
    }

    try {
      // Si ya tenemos el rol del JWT, usarlo. Si no, consultarlo.
      if (!userRole) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
          return false;
        }
        userRole = user.role as UserRole;
      }

      // Verificar si el rol del usuario está en los roles requeridos
      return requiredRoles.some((role) => userRole === role);
    } catch (error) {
      return false;
    }
  }
}
