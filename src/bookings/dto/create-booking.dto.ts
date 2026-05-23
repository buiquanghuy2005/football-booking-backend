import {
    IsDateString,
    IsString,
} from 'class-validator';

export class CreateBookingDto {
    @IsString()
    fieldId: string;

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;

    @IsString()
    customerName: string;

    @IsString()
    phoneNumber: string;
}