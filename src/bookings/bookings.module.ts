import { Module } from '@nestjs/common';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

import { PrismaModule } from 'src/prisma/prisma.module';

import { BookingsGateway } from './bookings.gateway';

@Module({
  imports: [PrismaModule],

  controllers: [BookingsController],

  providers: [
    BookingsService,
    BookingsGateway,
  ],
})
export class BookingsModule { }