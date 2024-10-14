import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPost } from "./entities/tpost";
import { TUser } from "./entities/tuser";
import { UserModule } from "./graphql/user/user.module";
import { TImage } from "./entities/timage";
import { PostModule } from "./graphql/post/post.module";
import { ImageModule } from "./graphql/image/image.module";
import { AuthModule } from "./auth/auth.module";
import { TPostSection } from "./entities/tpost_section";

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
    TypeOrmModule.forFeature([TPost, TUser, TImage, TPostSection]),
    AuthModule,
    UserModule,
    PostModule,
    ImageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
