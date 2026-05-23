import {
    Controller,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) { }

    // 👤 user hiện tại
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: any) {
        return req.user;
    }

    // 🛠️ ADMIN ONLY - xem toàn bộ users
    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Get()
    findAll() {
        return this.usersService.findAll();
    }
}