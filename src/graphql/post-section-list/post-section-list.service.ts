import { Injectable } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TPostSectionList } from "src/entities/tpost_sections_list";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PostSectionListService extends GenericService<TPostSectionList> {
  constructor(
    @InjectRepository(TPostSectionList)
    repository: Repository<TPostSectionList>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }
}
