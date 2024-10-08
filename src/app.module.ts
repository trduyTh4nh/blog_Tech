import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostModule } from "./graphql/post/post.module";
import { Post } from "./entities/tpost";
import { User } from "./entities/t.user";
import { UserModule } from "./graphql/user/user.module";
import { CommentModule } from "./graphql/comment/comment.module";
import { InteractionModule } from "./graphql/interaction/interaction.module";
import { AuthModule } from './restapi/auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      csrfPrevention: false,
      allowBatchedHttpRequests: true,
      introspection: true,
      autoSchemaFile: "schema.gql",
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "blog",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      logging: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Post, User]),
    PostModule,
    UserModule,
    CommentModule,
    InteractionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
