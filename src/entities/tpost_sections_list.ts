import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TPostSection } from "./tpost_section";

@Entity("post_section_list")
export class TPostSectionList {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ name: "section_id" })
  sectionId: string;

  @Column({ type: "text" })
  item: string;

  @Column({ type: "text", nullable: true })
  image: string;

  @ManyToOne(() => TPostSection, (section) => section.listItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "section_id" })
  section: TPostSection;
}
