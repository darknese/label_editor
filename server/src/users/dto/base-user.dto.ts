import { Gender, Role } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({ example: 'user@example.com', maxLength: 50, description: 'Email пользователя' })
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({ minLength: 6, maxLength: 100, description: 'Пароль пользователя' })
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ minLength: 3, maxLength: 50, description: 'Имя пользователя' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ minLength: 3, maxLength: 50, description: 'Фамилия пользователя' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({ minLength: 3, maxLength: 50, description: 'Отчество пользователя' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sirName?: string;

  @ApiPropertyOptional({ example: '+7 999 999 99 99', maxLength: 50, description: 'Телефон пользователя' })
  @IsOptional()
  @IsPhoneNumber('RU')
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Пол пользователя' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: Role, description: 'Роль пользователя' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ description: 'Активен ли пользователь' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
