import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { UserDTO, UserInputDTO } from "src/dto/TUserDTO";
import { UserService } from "./user.service";
import { User } from "src/entities/t.user";
import { PostDTO } from "src/dto/TPostDTO";
import { convertUserEntityToDTO } from "src/utils/convert.func";

@Resolver(() => UserDTO)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [UserDTO])
  async getAllUser(): Promise<UserDTO[]> {
    const users = await this.userService.findAllUser();
    const userConvert = users.map((user) => convertUserEntityToDTO(user));
    return userConvert;
  }

  @Query(() => UserDTO)
  async getUser(
    @Args("id", { type: () => String }) id: string
  ): Promise<UserDTO> {
    const user = await this.userService.findOneUser(id);
    return convertUserEntityToDTO(user);
  }

  @Mutation(() => UserDTO)
  async signup(@Args("userInputDTO") userDTO: UserInputDTO): Promise<UserDTO> {
    console.log(userDTO);
    const user = await this.userService.signup(userDTO);
    console.log(user);
    return {
      id: user.id,
      userName: user.user_name,
      email: user.email,
      password: user.password,
      bio: user.bio,
      profilePicture: user.profile_picture,
      posts: [] as PostDTO[],
    };
  }
}
