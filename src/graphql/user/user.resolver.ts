import { Resolver } from "@nestjs/graphql";
import { TUserDTO } from "src/dto/TUserDTO";
import { createGenericResolver } from "../generic/generic.resolver";
import { TUser } from "src/entities/tuser";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guard/auth.guard";

@Resolver(() => TUserDTO)
@UseGuards(AuthGuard)
export class UserResolver extends createGenericResolver<TUser>(
  TUserDTO,
  TUser
) {}
