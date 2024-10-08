import { PostDTO } from "src/dto/TPostDTO";
import { UserDTO } from "src/dto/TUserDTO";
import { User } from "src/entities/t.user";
import { Post } from "src/entities/tpost";

export function toPostDTO(post: Post): PostDTO {
  const postDTO = new PostDTO();
  postDTO.id = post.id;
  postDTO.title = post.title;
  postDTO.content = post.content;
  postDTO.date = post.date;

  if (post.user) {
    const userDTO = new UserDTO();
    userDTO.id = post.user.id;
    userDTO.userName = post.user.user_name;
    userDTO.email = post.user.email;
    userDTO.bio = post.user.bio;
    userDTO.profilePicture = post.user.profile_picture;
    postDTO.user = userDTO;
  }

  return postDTO;
}

export function convertUserEntityToDTO(user: User): UserDTO {
  const postDTO: PostDTO[] = [];

  if (user.posts && Array.isArray(user.posts)) {
    user.posts.forEach((post) => {
      postDTO.push({
        id: post.id,
        title: post.title,
        content: post.content,
        date: post.date,
        user: post.user
          ? {
              id: post.user.id,
              userName: post.user.user_name,
              email: post.user.email,
              bio: post.user.bio,
              profilePicture: post.user.profile_picture,
              password: post.user.password,
            }
          : null,
      });
    });
  }

  return {
    id: user.id,
    userName: user.user_name,
    email: user.email,
    password: user.password,
    bio: user.bio,
    profilePicture: user.profile_picture,
    posts: postDTO ?? [],
  };
}

export function convertPostEntityToDTO(post: Post): PostDTO {
  console.log(post);
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    date: post.date,
    user: post.user
      ? {
          id: post.user.id,
          userName: post.user.user_name,
          email: post.user.email,
          password: post.user.password,
          bio: post.user.bio,
          profilePicture: post.user.profile_picture,
        }
      : null,
  };
}
