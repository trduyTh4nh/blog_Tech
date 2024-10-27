import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TPostSection } from "./tpost_section";

@Entity("post_section_code")
export class TPostSectionCode {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "section_id" })
  sectionId: string;

  @Column({ type: "text" })
  code: string;

  @Column({ type: "varchar", length: 100 })
  language: string;

  @Column({ type: "text", nullable: true })
  image: string;

  @ManyToOne(() => TPostSection, (section) => section.codeItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "section_id" })
  section: TPostSection;
}
