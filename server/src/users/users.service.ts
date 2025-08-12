import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.input';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.VIEWER, // Por defecto VIEWER
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(id: string, data: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Métodos específicos para roles
  async findAdmins() {
    return this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async makeUserAdmin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.ADMIN },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === UserRole.ADMIN;
  }
}
