import {
    IsEmail,
    IsIn,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    // ⭐ ROLE
    @IsOptional()
    @IsString()
    @IsIn(['USER', 'OWNER'])
    role?: string;
}