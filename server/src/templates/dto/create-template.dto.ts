import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateTemplateDto {
    @ApiProperty({ description: 'Название шаблона' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Описание шаблона', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Данные шаблона в JSON формате' })
    @IsObject()
    data: any;
}

export class UpdateTemplateDto {
    @ApiProperty({ description: 'Название шаблона', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Описание шаблона', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Данные шаблона в JSON формате', required: false })
    @IsOptional()
    @IsObject()
    data?: any;
} 