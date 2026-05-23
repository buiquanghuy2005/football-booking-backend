import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { RolesGuard } from 'src/auth/roles.guard';

import { Roles } from 'src/auth/roles.decorator';

@Controller('bookings')
export class BookingsController {
    constructor(
        private bookingsService: BookingsService,
    ) { }
    //
    // 👤 USER
    //

    // CREATE BOOKING
    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('USER')
    @Post()
    create(
        @Body() dto: any,
        @Req() req: any,
    ) {
        return this.bookingsService.create(
            dto,
            req.user.userId,
        );
    }

    // MY BOOKINGS
    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('USER')
    @Get('me')
    myBookings(@Req() req: any) {
        return this.bookingsService.myBookings(
            req.user.userId,
        );
    }

    //
    // 🌍 PUBLIC
    //

    // BOOKINGS BY FIELD
    @Get('field/:id')
    getFieldBookings(
        @Param('id') id: string,
    ) {
        return this.bookingsService.getFieldBookings(
            id,
        );
    }

    //
    // 🏟️ OWNER
    //

    // OWNER BOOKINGS
    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('OWNER')
    @Get('owner')
    getOwnerBookings(
        @Req() req: any,
    ) {
        return this.bookingsService.getBookingsByOwner(
            req.user.userId,
        );
    }

    //
    // ✅ OWNER + ADMIN
    //

    // CONFIRM BOOKING
    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('OWNER', 'ADMIN')
    @Post('confirm/:id')
    confirmBooking(
        @Param('id') id: string,
    ) {
        return this.bookingsService.updateStatus(
            id,
            'CONFIRMED',
        );
    }

    // CANCEL BOOKING
    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('OWNER', 'ADMIN')
    @Post('cancel/:id')
    cancelBooking(
        @Param('id') id: string,
    ) {
        return this.bookingsService.updateStatus(
            id,
            'CANCELLED',
        );
    }

    //
    // 🛠️ ADMIN
    //

    // ALL BOOKINGS
    @UseGuards(
        JwtAuthGuard,
        RolesGuard,
    )
    @Roles('ADMIN')
    @Get('admin')
    getAllBookings() {
        return this.bookingsService.findAll();
    }

}
