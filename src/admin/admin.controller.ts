import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)
@Roles('ADMIN')
export class AdminController {
    constructor(
        private adminService: AdminService,
    ) { }

    // Dashboard
    @Get('stats')
    getStats() {
        return this.adminService.getStats();
    }

    // USERS
    @Get('users')
    getUsers() {
        return this.adminService.getUsers();
    }

    @Get('users/:id')
    getUser(
        @Param('id') id: string,
    ) {
        return this.adminService.getUser(id);
    }

    @Patch('users/:id/toggle')
    toggleUser(
        @Param('id') id: string,
    ) {
        return this.adminService.toggleUser(id);
    }

    // OWNERS
    @Get('owners')
    getOwners() {
        return this.adminService.getOwners();
    }
}