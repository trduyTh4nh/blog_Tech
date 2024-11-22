import { Resolver } from "@nestjs/graphql";
import { TUserDTO } from "src/dto/TUserDTO";
import { createGenericResolver } from "../generic/generic.resolver";
import { TUser } from "src/entities/tuser";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { Roles } from "src/auth/role/role.decorator";
import * as dotenv from "dotenv";
dotenv.config();

@Resolver(() => TUserDTO)
@UseGuards(AuthGuard)
@Roles(process.env.USER_ROLE)
export class UserResolver extends createGenericResolver<TUser>(
  TUserDTO,
  TUser
) {}
