import { forwardRef, Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TUser } from "src/entities/tuser";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([TUser]), forwardRef(() => AuthModule)],
  exports: [TypeOrmModule, UserService],
  providers: [UserResolver, UserService],
})
export class UserModule {}
