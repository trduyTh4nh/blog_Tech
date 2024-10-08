import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./t.user";

@Entity("post")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "user_id", nullable: true })
  userId: string | null;

  @Column({ type: "varchar", length: 200 })
  title: string | null;

  @Column({ type: "text" })
  content: string | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date: Date | null;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
