import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

export interface JwtPayload {
  email: string
  sub: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default_secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    console.log('JWT Payload:', payload);
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      console.warn(`User with email ${payload.email} not found`);
      throw new UnauthorizedException('User not found');
    }
    console.log(`User found: ${user.email}`);
    return user;
  }

}