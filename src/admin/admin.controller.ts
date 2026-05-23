import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('admin')
export class AdminController {
    constructor(
        private prisma: PrismaService,
    ) { }

    // 🛠️ ADMIN DASHBOARD STATS
    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Get('stats')
    async getStats() {
        const users =
            await this.prisma.user.count();

        const fields =
            await this.prisma.field.count();

        const bookings =
            await this.prisma.booking.count();

        return {
            users,
            fields,
            bookings,
        };
    }
}