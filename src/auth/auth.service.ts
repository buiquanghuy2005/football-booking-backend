import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { Role } from '@prisma/client';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(
        dto: RegisterDto,
    ) {
        const existingUser =
            await this.usersService.findByEmail(
                dto.email,
            );

        // ⭐ email existed
        if (existingUser) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        // ⭐ hash password
        const hashedPassword =
            await bcrypt.hash(
                dto.password,
                10,
            );

        // ⭐ only USER or OWNER
        const role =
            dto.role === 'OWNER'
                ? Role.OWNER
                : Role.USER;

        // ⭐ create user
        const user =
            await this.usersService.create(
                {
                    email: dto.email,

                    password:
                        hashedPassword,

                    role,
                },
            );

        // ❗ remove password
        const {
            password,
            ...result
        } = user;

        return result;
    }

    async login(dto: LoginDto) {
        const user =
            await this.usersService.findByEmail(
                dto.email,
            );

        if (!user) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        const isPasswordValid =
            await bcrypt.compare(
                dto.password,
                user.password,
            );

        if (!isPasswordValid) {
            throw new UnauthorizedException(
                'Invalid credentials',
            );
        }

        // 🔐 JWT PAYLOAD
        const payload = {
            sub: user.id,

            email: user.email,

            role: user.role,
        };

        const access_token =
            await this.jwtService.signAsync(
                payload,
            );

        return {
            access_token,

            user: {
                id: user.id,

                email: user.email,

                role: user.role,
            },
        };
    }
}