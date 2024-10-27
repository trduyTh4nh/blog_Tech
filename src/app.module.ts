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
import { PostSectionModule } from "./graphql/post-section/post-section.module";
import { ImageRestService } from "./rest-api/image-rest/image-rest.service";
import { ImageRestController } from "./rest-api/image-rest/image-rest.controller";
import { ImageRestModule } from "./rest-api/image-rest/image-rest.module";
import { TPostSectionType } from "./entities/tpost_sections_type";
import { TPostSectionList } from "./entities/tpost_sections_list";
import { TPostSectionCode } from "./entities/tpost_sections_code";
import { TPostSectionParagraph } from "./entities/tpost_sections_paragraph";
import { PostSectionTypeModule } from './graphql/post-section-type/post-section-type.module';
import { PostSectionListModule } from './graphql/post-section-list/post-section-list.module';
import { PostSectionCodeResolver } from './graphql/post-section-code/post-section-code.resolver';
import { PostSectionCodeModule } from './graphql/post-section-code/post-section-code.module';
import { PostSectionParagraphService } from './graphql/post-section-paragraph/post-section-paragraph.service';
import { PostSectionParagraphResolver } from './graphql/post-section-paragraph/post-section-paragraph.resolver';
import { PostSectionParagraphModule } from './graphql/post-section-paragraph/post-section-paragraph.module';

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
    TypeOrmModule.forFeature([
      TPost,
      TUser,
      TImage,
      TPostSection,
      TPostSectionType,
      TPostSectionList,
      TPostSectionCode,
      TPostSectionParagraph,
    ]),
    AuthModule,
    UserModule,
    PostModule,
    ImageModule,
    AuthModule,
    PostSectionModule,
    ImageRestModule,
    PostSectionTypeModule,
    PostSectionListModule,
    PostSectionCodeModule,
    PostSectionParagraphModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostSectionCodeResolver, PostSectionParagraphService, PostSectionParagraphResolver],
})
export class AppModule {}
