import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { v2 as cloudinary } from 'cloudinary';

import { FieldsService } from './fields.service';

import { CreateFieldDto } from './dto/create-field.dto';

import { Roles } from 'src/auth/roles.decorator';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('fields')
export class FieldsController {
    constructor(
        private fieldsService: FieldsService,
    ) { }

    // 🌍 PUBLIC - all fields
    @Get()
    findAll() {
        return this.fieldsService.findAll();
    }

    // 🏟️ OWNER - my fields
    @UseGuards(JwtAuthGuard)
    @Roles('OWNER')
    @Get('owner')
    getMyFields(@Request() req) {
        return this.fieldsService.findByOwner(
            req.user.userId,
        );
    }

    // 🛠️ ADMIN - all fields
    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Get('admin')
    getAllForAdmin() {
        return this.fieldsService.findAll();
    }

    // 🌍 PUBLIC - detail
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fieldsService.findOne(id);
    }

    // 🏟️ OWNER + ADMIN - create field
    @UseGuards(JwtAuthGuard)
    @Roles('OWNER', 'ADMIN')
    @Post()
    @UseInterceptors(
        FileInterceptor('image'),
    )
    async create(
        @UploadedFile() file: any,
        @Body() dto: CreateFieldDto,
        @Request() req,
    ) {
        let imageUrl = '';

        if (file) {
            const uploaded =
                await new Promise<any>(
                    (resolve, reject) => {
                        cloudinary.uploader
                            .upload_stream(
                                {
                                    folder:
                                        'football-booking',
                                },
                                (
                                    error,
                                    result,
                                ) => {
                                    if (error)
                                        reject(error);

                                    resolve(result);
                                },
                            )
                            .end(file.buffer);
                    },
                );

            imageUrl =
                uploaded.secure_url;
        }

        return this.fieldsService.create(
            {
                ...dto,
                imageUrl,
            },
            req.user.userId,
        );
    }

    // ✏️ OWNER + ADMIN - update field
    @UseGuards(JwtAuthGuard)
    @Roles('OWNER', 'ADMIN')
    @Put(':id')
    @UseInterceptors(
        FileInterceptor('image'),
    )
    async update(
        @Param('id') id: string,
        @UploadedFile() file: any,
        @Body() dto: any,
        @Request() req,
    ) {
        let imageUrl =
            dto.imageUrl || '';

        // upload new image
        if (file) {
            const uploaded =
                await new Promise<any>(
                    (resolve, reject) => {
                        cloudinary.uploader
                            .upload_stream(
                                {
                                    folder:
                                        'football-booking',
                                },
                                (
                                    error,
                                    result,
                                ) => {
                                    if (error)
                                        reject(error);

                                    resolve(result);
                                },
                            )
                            .end(file.buffer);
                    },
                );

            imageUrl =
                uploaded.secure_url;
        }

        return this.fieldsService.update(
            id,
            {
                ...dto,
                imageUrl,
            },
            req.user.userId,
        );
    }

    // 🗑️ OWNER + ADMIN - delete field
    @UseGuards(JwtAuthGuard)
    @Roles('OWNER', 'ADMIN')
    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Request() req,
    ) {
        return this.fieldsService.remove(
            id,
            req.user.userId,
        );
    }
}