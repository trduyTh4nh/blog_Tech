import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TPost } from "./tpost";
import { TPostSectionType } from "./tpost_sections_type";
import { TPostSectionList } from "./tpost_sections_list";
import { TPostSectionCode } from "./tpost_sections_code";
import { TPostSectionParagraph } from "./tpost_sections_paragraph";

@Entity("post_sections")
export class TPostSection {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "post_id" })
  postId: string;

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

  @Column({ name: "section_type_id" })
  sectionTypeId: string;

  @ManyToOne(() => TPost, (post) => post.sections, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: TPost;

  @ManyToOne(() => TPostSectionType, (type) => type.sections, { eager: true })
  @JoinColumn({ name: "section_type_id" })
  sectionType: TPostSectionType;

  @OneToMany(() => TPostSectionList, (list) => list.section)
  listItems: TPostSectionList[];

  @OneToMany(() => TPostSectionCode, (code) => code.section)
  codeItems: TPostSectionCode[];

  @OneToMany(() => TPostSectionParagraph, (paragraph) => paragraph.section)
  paragraphItems: TPostSectionParagraph[];
}
