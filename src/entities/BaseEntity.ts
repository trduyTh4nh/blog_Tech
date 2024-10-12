import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity as TypeORMBaseEntity } from 'typeorm';

@Entity()
export class BaseEntity extends TypeORMBaseEntity {
  @PrimaryColumn({ type: 'character varying', name: 'id', length: 20 })
  id: string;
}
