import { Injectable } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TPostSection } from "src/entities/tpost_section";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PostSectionService extends GenericService<TPostSection> {
  constructor(
    @InjectRepository(TPostSection) repository: Repository<TPostSection>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }
}
