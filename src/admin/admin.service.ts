import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async getStats() {
        const users =
            await this.prisma.user.count();

        const owners =
            await this.prisma.user.count({
                where: {
                    role: 'OWNER',
                },
            });

        const fields =
            await this.prisma.field.count();

        const bookings =
            await this.prisma.booking.count();

        return {
            users,
            owners,
            fields,
            bookings,
        };
    }

    async getUsers() {
        return this.prisma.user.findMany({
            where: {
                role: 'USER',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getOwners() {
        return this.prisma.user.findMany({
            where: {
                role: 'OWNER',
            },

            include: {
                fields: {
                    include: {
                        bookings: true,
                    },
                },
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getUser(id: string) {
        return this.prisma.user.findUnique({
            where: { id },

            include: {
                bookings: true,
                fields: true,
            },
        });
    }

    async toggleUser(id: string) {
        const user =
            await this.prisma.user.findUnique({
                where: { id },
            });

        return this.prisma.user.update({
            where: { id },

            data: {
                isActive:
                    !user?.isActive,
            },
        });
    }
}