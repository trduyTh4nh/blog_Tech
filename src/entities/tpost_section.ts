import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TPost } from "./tpost";

@Entity("post_sections")
export class TPostSection {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "post_id" })
  postId: string;

  @ManyToOne(() => TPost, (post) => post.sections, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: TPost;

  @Column({ type: "int" })
  order: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  header?: string;

  @Column({ type: "text", nullable: true })
  content?: string;

  @Column({ type: "varchar", nullable: true, length: 1500 })
  imageUrl?: string;

  @Column({ type: "varchar", length: 100 })
  type: "header" | "content" | "image";
}
