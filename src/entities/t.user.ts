import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./tpost";
import { InputType } from "@nestjs/graphql";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string | null;

    @Column({ type: 'varchar', length: 50 })
    user_name: string | null;

    @Column({ type: 'varchar', length: 100 })
    email: string | null;

    @Column({ type: 'varchar', length: 50 })
    password: string | null;

    @Column({ type: 'varchar', length: 500 })
    bio: string | null;

    @Column({ type: 'varchar', length: 1000 })
    profile_picture: string | null;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

}
