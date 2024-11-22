import { Injectable } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TImage } from "src/entities/timage";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class ImageService extends GenericService<TImage> {
  constructor(
    @InjectRepository(TImage) repository: Repository<TImage>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }
}
