import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '@users/dto/base-user.dto';

export class LoginUserDto extends PickType(BaseUserDto, ['email', 'password'] as const) {}
