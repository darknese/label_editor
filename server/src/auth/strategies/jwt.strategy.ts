import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService } from '@users/users.service'
import { User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

export interface JwtPayload {
  username: string
  sub: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY', 'default_secret'),
    });
  }

  async validate({ email }: any): Promise<User> {
    return (await this.usersService.findOne(email)) as User
  }
}