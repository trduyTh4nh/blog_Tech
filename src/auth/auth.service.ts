import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TUser } from "src/entities/tuser";
import { UserService } from "src/graphql/user/user.service";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TUser)
    private userRepository: Repository<TUser>,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password!");
    }
    const isPasswordMatched = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException("Invalid email or password!");
    }
    const { password, ...result } = user;

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
    };
  }

  async signUp(email: string, username: string, pass: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(pass, 10);

    const user = await this.userRepository.create({
      userName: username,
      email: email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const token = this.jwtService.sign({ id: user.id });

    const { password, ...result } = user;
    return { token: token, user: result };
  }
}
