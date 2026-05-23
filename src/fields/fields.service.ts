import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FieldsService {
    constructor(
        private prisma: PrismaService,
    ) { }

    // 🏟️ OWNER + ADMIN - create field
    create(dto: any, ownerId: string) {
        return this.prisma.field.create({
            data: {
                name: dto.name,

                address: dto.address,

                price: Number(dto.price),

                description:
                    dto.description,

                imageUrl:
                    dto.imageUrl || null,

                ownerId,
            },

            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    // 🌍 PUBLIC - all fields
    findAll() {
        return this.prisma.field.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // 🌍 PUBLIC - field detail
    findOne(id: string) {
        return this.prisma.field.findUnique({
            where: { id },

            include: {
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },

                bookings: true,
            },
        });
    }

    // 🏟️ OWNER - my fields
    findByOwner(ownerId: string) {
        return this.prisma.field.findMany({
            where: {
                ownerId,
            },

            include: {
                bookings: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // ✏️ OWNER + ADMIN - update field
    async update(
        id: string,
        dto: any,
        userId: string,
    ) {
        const field =
            await this.prisma.field.findUnique({
                where: { id },

                include: {
                    owner: true,
                },
            });

        if (!field) {
            throw new NotFoundException(
                'Field not found',
            );
        }

        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

        if (
            field.ownerId !== userId &&
            user?.role !== 'ADMIN'
        ) {
            throw new ForbiddenException(
                'Unauthorized',
            );
        }

        return this.prisma.field.update({
            where: { id },

            data: {
                name: dto.name,

                address: dto.address,

                price: Number(dto.price),

                description:
                    dto.description,

                imageUrl:
                    dto.imageUrl ||
                    field.imageUrl,
            },
        });
    }

    // 🗑️ OWNER + ADMIN - delete field
    async remove(
        id: string,
        userId: string,
    ) {
        const field =
            await this.prisma.field.findUnique({
                where: { id },
            });

        if (!field) {
            throw new NotFoundException(
                'Field not found',
            );
        }

        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

        if (
            field.ownerId !== userId &&
            user?.role !== 'ADMIN'
        ) {
            throw new ForbiddenException(
                'Unauthorized',
            );
        }

        return this.prisma.field.delete({
            where: { id },
        });
    }
}