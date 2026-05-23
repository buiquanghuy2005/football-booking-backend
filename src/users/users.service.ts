import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: {
        email: string;
        password: string;
    }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                role: 'USER', // ⭐ default role
            },
        });
    }

    // 🛠️ ADMIN - xem toàn bộ users
    findAll() {
        return this.prisma.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}