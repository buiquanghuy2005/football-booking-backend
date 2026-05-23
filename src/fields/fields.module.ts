import { Module } from '@nestjs/common';

import { FieldsController } from './fields.controller';
import { FieldsService } from './fields.service';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [FieldsController],

  providers: [FieldsService],
})
export class FieldsModule { }