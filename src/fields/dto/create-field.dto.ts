import { Type } from 'class-transformer';

import {
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateFieldDto {
    @IsString()
    name!: string;

    @IsString()
    address!: string;

    @Type(() => Number)
    @IsNumber()
    price!: number;

    @IsString()
    description!: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}