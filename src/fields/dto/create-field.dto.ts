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
