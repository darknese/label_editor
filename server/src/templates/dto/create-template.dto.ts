import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateTemplateDto {
    @ApiProperty({ description: 'Название шаблона' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Данные шаблона в JSON формате' })
    @IsObject()
    data: any;

    @ApiProperty({ description: 'ID изображений для шаблона', required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    imageIds?: string[];
}

export class UpdateTemplateDto {
    @ApiProperty({ description: 'Название шаблона', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Данные шаблона в JSON формате', required: false })
    @IsOptional()
    @IsObject()
    data?: any;

    @ApiProperty({ description: 'ID изображений для шаблона', required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    imageIds?: string[];
} 