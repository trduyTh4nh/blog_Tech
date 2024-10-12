import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { BaseEntity } from "../../entities/BaseEntity";
import { EntityManager, In, Repository } from "typeorm";

@Injectable()
export class GenericService<T> {
  protected repository: Repository<T>;
  protected entityManager: EntityManager;

  constructor(
    @InjectRepository(BaseEntity) repository: Repository<T>,
    @InjectEntityManager() entityManager: EntityManager = null
  ) {
    this.repository = repository;
    this.entityManager = entityManager;
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(id: any): Promise<T> {
    const record = await this.repository.findOne({
      where: { id } as any, // Explicitly cast to avoid type issues
    });

    if (!record) {
      throw new Error("Record not found");
    }

    return record;
  }

  async findBy(data: any, field: string): Promise<T[]> {
    const record = await this.repository.findBy({
      [field]: data[field],
    } as any);
    if (!record) {
      throw new Error("Record not found");
    }
    return record;
  }
  async findIn(data: any, field: string): Promise<T[]> {
    console.log("findId", data);
    const record = await this.repository.findBy({
      [field]: In(data[field]),
    } as any);
    if (!record) {
      throw new Error("Record not found");
    }
    return record;
  }

  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async delete(id: any): Promise<void> {
    await this.repository.delete(id);
  }

  async update(id: any, entity: any): Promise<T> {
    await this.repository.update(id, entity);
    return await this.repository.findOne({
      where: { id } as any, // Explicitly cast to avoid type issues
    });
  }

  async upsertById(data: any) {
    return await this.entityManager.transaction(async () => {
      // Kiểm tra xem đã có dữ liệu chưa
      const id = data.id;
      const findExistingData = await this.repository.findOne({
        where: { id } as any,
      });

      // Nếu đã có dữ liệu thì update, chưa có thì tạo mới
      if (findExistingData) {
        data.modifyId = "999999";
        data.modifyDate = new Date();
        await this.repository.update(id, data as any);
        const updatedData = await this.repository.findOne({
          where: { id } as any,
        });
        return updatedData;
      } else {
        data.createId = "999999";
        data.createDate = new Date();
        data.modifyId = "999999";
        data.modifyDate = new Date();
        const newData = this.repository.create(data as any);
        return await this.repository.save(newData);
      }
    });
  }

  async upsertByField(data: any, field: string) {
    return await this.entityManager.transaction(async () => {
      // Kiểm tra xem đã có dữ liệu chưa
      const findExistingData = await this.repository.findOne({
        where: { [field]: data[field] } as any,
      });

      const fields = [field];
      const whereCondition = fields.reduce((acc, field) => {
        acc[field] = data[field];
        return acc;
      }, {} as any);

      // Nếu đã có dữ liệu thì update, chưa có thì tạo mới
      if (findExistingData) {
        data.modifyId = "999999";
        data.modifyDate = new Date();
        const updateResult = await this.repository.update(
          whereCondition,
          data as any
        );
        if (updateResult.affected === 0) {
          throw new Error("Update failed");
        }
        const updatedData = await this.repository.findOne({
          where: { [field]: data[field] } as any,
        });
        return updatedData;
      } else {
        data.createId = "999999";
        data.createDate = new Date();
        data.modifyId = "999999";
        data.modifyDate = new Date();
        const newData = this.repository.create(data as any);
        return await this.repository.save(newData);
      }
    });
  }

  async upsertByListOfField(data: any, fields: string[]) {
    return await this.entityManager.transaction(async () => {
      // Create where condition
      const whereCondition = fields.reduce((acc, field) => {
        acc[field] = data[field];
        return acc;
      }, {} as any);

      // Check if the record exists
      const findExistingData = await this.repository.findOne({
        where: whereCondition,
      });

      // If the record exists, update it; otherwise, create a new record
      if (findExistingData) {
        data.modifyId = "999999";
        data.modifyDate = new Date();
        await this.repository.update(whereCondition, data);
        const updatedData = await this.repository.findOne({
          where: whereCondition,
        });
        return updatedData;
      } else {
        data.createId = "999999";
        data.createDate = new Date();
        data.modifyId = "999999";
        data.modifyDate = new Date();
        const newData = this.repository.create(data);
        return await this.repository.save(newData);
      }
    });
  }

  async upsertListById(data: any[]) {
    return await this.entityManager.transaction(async () => {
      const existData = [];
      const newData = [];

      const findExistingData = await this.repository.find({
        where: { id: In(data.map((d) => d.id)) } as any,
      });

      for (const dto of data) {
        // Kiểm tra xem đã có dữ liệu chưa
        const id = dto.id;

        const check = findExistingData.find((d) => d["id"] === id);

        if (check) {
          dto.modifyId = "999999";
          dto.modifyDate = new Date();
          existData.push(dto);
        } else {
          dto.createId = "999999";
          dto.createDate = new Date();
          newData.push(dto);
        }
      }
      if (data && data.length > 0) {
        await this.repository.save(data);
      }

      for (const dto of existData) {
        //console.log('dto', dto);
        await this.repository.update(dto.id, dto as any);
      }
    });
  }

  async upsertListByField(data: any[], field: string) {
    return await this.entityManager.transaction(async () => {
      const existData = [];
      const newData = [];

      const findExistingData = await this.repository.find({
        where: { [field]: In(data.map((d) => d[field])) } as any,
      });

      for (const dto of data) {
        const check = findExistingData.find((d) => d[field] === dto[field]);

        if (check) {
          dto.modifyId = "999999";
          dto.modifyDate = new Date();
          existData.push(dto);
        } else {
          dto.createId = "999999";
          dto.createDate = new Date();
          newData.push(dto);
        }
      }

      console.log("newData", newData);
      console.log("existData", existData);

      if (newData && newData.length > 0) {
        await this.repository.save(newData);
      }

      for (const dto of existData) {
        const fields = [field];
        const whereCondition = fields.reduce((acc, field) => {
          acc[field] = dto[field];
          return acc;
        }, {} as any);
        await this.repository.update(whereCondition, dto as any);
      }
    });
  }

  async upsertListByListOfField(data: any[], fields: string[]) {
    return await this.entityManager.transaction(async () => {
      const existData = [];
      const newData = [];

      const findExistingData = await this.repository.find({
        where: fields.reduce((acc, field) => {
          acc[field] = In(data.map((d) => d[field]));
          return acc;
        }, {} as any),
      });

      for (const dto of data) {
        // Create where condition
        const whereCondition = fields.reduce((acc, field) => {
          acc[field] = dto[field];
          return acc;
        }, {} as any);

        // Check if the record exists
        const check = findExistingData.find((d) => {
          return fields.every((field) => d[field] === dto[field]);
        });

        if (check) {
          dto.modifyId = "999999";
          dto.modifyDate = new Date();
          existData.push(dto);
        } else {
          dto.createId = "999999";
          dto.createDate = new Date();
          newData.push(dto);
        }
      }

      if (newData && newData.length > 0) {
        await this.repository.save(newData);
      }

      for (const dto of existData) {
        // Create where condition
        const whereCondition = fields.reduce((acc, field) => {
          acc[field] = dto[field];
          return acc;
        }, {} as any);

        await this.repository.update(whereCondition, dto as any);
      }
    });
  }
}
