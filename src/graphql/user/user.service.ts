import { Injectable, Logger } from "@nestjs/common";
import { GenericService } from "../generic/generic.service";
import { TUser } from "src/entities/tuser";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class UserService extends GenericService<TUser> {
  constructor(
    @InjectRepository(TUser) repository: Repository<TUser>,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    super(repository, entityManager);
  }

  async findOne(email: string): Promise<TUser> {
    return this.repository.findOne({
      where: { email: email },
      relations: ["posts"],
    });
  }
}
