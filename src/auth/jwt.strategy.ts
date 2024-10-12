import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TUser } from "src/entities/tuser";
import { Repository } from "typeorm";
require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(TUser)
    private userRepository: Repository<TUser>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);

    const { id } = payload;
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new UnauthorizedException("Login first to access");
    }
    const { password, ...returnData } = user;
    return returnData;
  }
}
