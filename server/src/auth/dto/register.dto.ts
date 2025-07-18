// src/auth/dto/user-register.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsDateString } from 'class-validator'

export class UserRegisterDto {
  @IsEmail()
  email: string

  @MinLength(6)
  password: string

  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsOptional()
  @IsDateString()
  birthday?: string
}
