import { Injectable } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TPost } from "src/entities/tpost";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class PostService extends GenericService<TPost> {
  constructor(
    @InjectRepository(TPost) repository: Repository<TPost>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }
}
