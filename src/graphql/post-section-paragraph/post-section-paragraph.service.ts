import { Injectable } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TPostSectionParagraph } from "src/entities/tpost_sections_paragraph";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PostSectionParagraphService extends GenericService<TPostSectionParagraph> {
  constructor(
    @InjectRepository(TPostSectionParagraph)
    repository: Repository<TPostSectionParagraph>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }
}
