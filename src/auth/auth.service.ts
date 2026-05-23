import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
        });

        // ❗ không trả password ra ngoài
        const { password, ...result } = user;

        return result;
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 🔐 JWT PAYLOAD (THÊM ROLE)
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role, // ⭐ IMPORTANT
        };

        const access_token = await this.jwtService.signAsync(payload);

        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role, // ⭐ FRONTEND DÙNG CÁI NÀY
            },
        };
    }
}