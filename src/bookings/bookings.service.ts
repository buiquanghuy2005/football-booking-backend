import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

// ⭐ IMPORT ENUM
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(
        private prisma: PrismaService,
    ) { }

    // 👤 USER create booking
    async create(dto: any, userId: string) {
        const existedBooking =
            await this.prisma.booking.findFirst({
                where: {
                    fieldId: dto.fieldId,
                    startTime: new Date(dto.startTime),
                },
            });

        if (existedBooking) {
            throw new BadRequestException(
                'Slot already booked',
            );
        }

        return this.prisma.booking.create({
            data: {
                startTime: new Date(dto.startTime),

                endTime: new Date(dto.endTime),

                customerName:
                    dto.customerName,

                phoneNumber:
                    dto.phoneNumber,

                // ⭐ FIX ENUM
                status:
                    BookingStatus.PENDING,

                user: {
                    connect: {
                        id: userId,
                    },
                },

                field: {
                    connect: {
                        id: dto.fieldId,
                    },
                },
            },
        });
    }

    // 🌍 PUBLIC - booking theo sân
    async getFieldBookings(fieldId: string) {
        return this.prisma.booking.findMany({
            where: {
                fieldId,
            },

            orderBy: {
                startTime: 'asc',
            },
        });
    }

    // 👤 USER - booking của chính họ
    async myBookings(userId: string) {
        return this.prisma.booking.findMany({
            where: {
                userId,
            },

            include: {
                field: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // 🏟️ OWNER - booking của sân họ
    async getBookingsByOwner(ownerId: string) {
        return this.prisma.booking.findMany({
            where: {
                field: {
                    ownerId,
                },
            },

            include: {
                field: true,
                user: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // 🏟️ OWNER - confirm / cancel booking
    async updateStatus(
        id: string,
        status: BookingStatus,
    ) {
        return this.prisma.booking.update({
            where: { id },

            data: { status },
        });
    }

    // 🛠️ ADMIN - xem toàn bộ booking
    async findAll() {
        return this.prisma.booking.findMany({
            include: {
                user: true,
                field: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}