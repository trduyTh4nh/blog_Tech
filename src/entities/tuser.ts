import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TPost } from "./tpost";
import { InputType } from "@nestjs/graphql";
require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();

@Entity("users")
export class TUser {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "user_name", type: "varchar", length: 150, unique: true })
  userName: string | null;

  @Column({ type: "varchar", length: 1000, unique: true })
  email: string | null;

  @Column({ type: "varchar", length: 500 })
  password: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  bio: string | null;

  @Column({
    name: "profile_picture",
    type: "varchar",
    length: 1000,
    nullable: true,
  })
  profilePicture: string | null;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column({
    type: "varchar",
    default: process.env.USER_ROLE,
  })
  role: string;

  @OneToMany(() => TPost, (post) => post.user, { nullable: true })
  posts: TPost[];
}
