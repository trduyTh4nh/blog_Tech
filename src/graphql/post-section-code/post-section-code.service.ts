import { Injectable } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TPostSectionCode } from "src/entities/tpost_sections_code";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PostSectionCodeService extends GenericService<TPostSectionCode> {
  constructor(
    @InjectRepository(TPostSectionCode)
    repository: Repository<TPostSectionCode>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }
}
