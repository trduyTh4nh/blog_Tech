import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/t.user";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
  exports: [TypeOrmModule],
})
export class UserModule {}
