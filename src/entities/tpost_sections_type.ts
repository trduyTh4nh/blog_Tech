import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TPostSection } from "./tpost_section";

@Entity("post_section_type")
export class TPostSectionType {
  @PrimaryGeneratedColumn("uuid")
  id: string | null;

  @Column({ type: "varchar", unique: true })
  name: string | null;

  @OneToMany(() => TPostSection, (section) => section.sectionType)
  sections: TPostSection[];
}
