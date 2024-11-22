import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { TUser } from "./tuser";
import { TImage } from "./timage";
import { TPostSection } from "./tpost_section";

@Entity("post")
export class TPost {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "user_id", nullable: true })
  userId: string | null;

  @Column({ type: "varchar", length: 200 })
  title: string | null;

  @Column({ type: "text" })
  content: string | null;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(() => TUser, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: TUser;

  @OneToMany(() => TImage, (image) => image.post)
  images: TImage[];

  @OneToMany(() => TPostSection, (section) => section.post, { nullable: true })
  sections?: TPostSection[];
}
