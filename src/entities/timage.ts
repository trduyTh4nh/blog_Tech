import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TPost } from "./tpost";

@Entity("images")
export class TImage {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "image_url", type: "varchar" })
  imageUrl: string | null;

  @Column({ type: "varchar" })
  description: string | null;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column({ name: "post_id", nullable: true })
  postId: string | null;

  @ManyToOne(() => TPost, (post) => post.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: TPost;
}
