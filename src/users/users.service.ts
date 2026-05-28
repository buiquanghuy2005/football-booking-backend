import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async findByEmail(
        email: string,
    ) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: {
        email: string;

        password: string;

        role?: Role;
    }) {
        return this.prisma.user.create({
            data: {
                email: data.email,

                password:
                    data.password,

                // ⭐ USER hoặc OWNER
                role:
                    data.role ||
                    Role.USER,
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