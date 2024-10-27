import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TPostSection } from "./tpost_section";

@Entity("post_section_paragraph")
export class TPostSectionParagraph {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "section_id" })
  sectionId: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text", nullable: true })
  image: string;

  @ManyToOne(() => TPostSection, (section) => section.paragraphItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "section_id" })
  section: TPostSection;
}
