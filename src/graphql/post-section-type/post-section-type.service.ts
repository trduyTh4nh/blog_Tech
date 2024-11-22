import { Injectable } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TPostSectionType } from "src/entities/tpost_sections_type";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PostSectionTypeService extends GenericService<TPostSectionType> {
  constructor(
    @InjectRepository(TPostSectionType)
    repository: Repository<TPostSectionType>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }
}
