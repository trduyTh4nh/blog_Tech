import { Type } from "@nestjs/common";
import {
  CustomScalar,
  Field,
  InputType,
  Int,
  ObjectType,
  Scalar,
  registerEnumType,
  ID,
} from "@nestjs/graphql";
import { getMetadataArgsStorage, SelectQueryBuilder } from "typeorm";
import {
  BooleanFilter,
  DateFilter,
  NumberFilter,
  StringFilter,
} from "./whereCondition";
import { format, parseISO } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { Kind, ValueNode } from "graphql";

function applyJoins<T>(
  queryBuilder: SelectQueryBuilder<T>,
  entity: any,
  alias: string = "entity"
) {
  const relations = getMetadataArgsStorage().relations.filter(
    (relation) => relation.target === entity
  );
  relations.forEach((relation) => {
    const relationAlias = `${alias}_${relation.propertyName}`;
    queryBuilder.leftJoinAndSelect(
      `${alias}.${relation.propertyName}`,
      relationAlias
    );
  });
}

export enum SortEnum {
  ASC = "ASC",
  DESC = "DESC",
}
registerEnumType(SortEnum, { name: "SortEnumType" });

export function generateGroupByEnum<T>(entity: Type<T>, enumName: string) {
  const columns = getMetadataArgsStorage().columns.filter(
    (col) => col.target === entity
  );

  const enumValues = columns.reduce((acc, column) => {
    const propertyName = column.propertyName;
    acc[propertyName] = propertyName;
    return acc;
  }, {});

  registerEnumType(enumValues, {
    name: enumName,
    description: `Fields available for grouping for ${enumName}`,
  });

  return enumValues;
}

@ObjectType()
export class PaginationInfo {
  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}

export function CreateInputType<T>(entity: Type<T>): Type<any> {
  const columns = getMetadataArgsStorage().columns.filter(
    (col) => col.target === entity
  );

  @InputType(`${entity.name}Input`)
  class DynamicInputType {}

  // console.log('columns', columns);
  // console.log('entity name', entity.name);
  columns.forEach((column) => {
    const propertyName = column.propertyName;
    const propertyType = Reflect.getMetadata(
      "design:type",
      entity.prototype,
      propertyName
    );
    if (propertyName === "metadata") {
      return;
    }
    // Map TypeScript types to GraphQL types
    let gqlType;
    if (propertyType === String) {
      gqlType = String;
    } else if (propertyType === Number) {
      gqlType = Number;
    } else if (propertyType === Boolean) {
      gqlType = Boolean;
    } else if (propertyType === Date) {
      gqlType = Date;
    } else {
      gqlType = propertyType;
    }

    Field(() => gqlType, { nullable: true })(
      DynamicInputType.prototype,
      propertyName
    );
  });

  return DynamicInputType;
}

const typeRegistry = new Map<string, Type<any>>();
const typeRegistryOrder = new Map<string, Type<any>>();

export function createDynamicWhereInput<T>(entity: Type<T>): Type<any> {
  const entityName = entity.name;

  const columns = getMetadataArgsStorage().columns.filter(
    (col) => col.target === entity
  );
  const relations = getMetadataArgsStorage().relations.filter(
    (rel) => rel.target === entity
  ) as any;

  // Check if the type is already registered to avoid duplicates
  if (typeRegistry.has(entityName)) {
    return typeRegistry.get(entityName)!;
  }

  @InputType(`${entityName}WhereInput`)
  class DynamicWhereInput {
    @Field(() => [DynamicWhereInput], { nullable: true })
    AND?: DynamicWhereInput[];

    @Field(() => [DynamicWhereInput], { nullable: true })
    OR?: DynamicWhereInput[];

    @Field(() => [DynamicWhereInput], { nullable: true })
    NOT?: DynamicWhereInput[];
  }
  // Register the type before defining its fields to handle self-referencing entities
  typeRegistry.set(entityName, DynamicWhereInput);

  columns.forEach((column) => {
    const propertyName = column.propertyName;
    const propertyType = Reflect.getMetadata(
      "design:type",
      entity.prototype,
      propertyName
    );
    if (propertyName === "metadata") {
      return;
    }
    let gqlType;
    if (propertyType === String) {
      gqlType = StringFilter;
    } else if (propertyType === Number) {
      gqlType = NumberFilter;
    } else if (propertyType === Boolean) {
      gqlType = BooleanFilter;
    } else if (propertyType === Date) {
      gqlType = DateFilter;
    } else if (propertyType === Object && propertyName === "metadata") {
      //gqlType = Object;
    } else {
      gqlType = propertyType;
    }

    Field(() => gqlType, { nullable: true })(
      DynamicWhereInput.prototype,
      propertyName
    );
  });

  relations.forEach((relation) => {
    const propertyName = relation.propertyName;
    const relationEntity = relation.type();
    // Assume that where input types for all entities are dynamically created and available
    const relationWhereInput = createDynamicWhereInput(relationEntity);
    Field(() => relationWhereInput as any, { nullable: true })(
      DynamicWhereInput.prototype,
      propertyName
    );
  });

  return DynamicWhereInput;
}

export function createNestedWhereInput<T>(entity: Type<T>): Type<any> {
  const entityName = entity.name;

  @InputType(`${entityName}WhereInput`)
  class NestedWhereInput {}

  return NestedWhereInput;
}

export function CreateOrderByInputType<T>(entity: Type<T>): Type<any> {
  const entityName = entity.name;

  if (typeRegistryOrder.has(entityName)) {
    return typeRegistryOrder.get(entityName)!;
  }

  @InputType(`${entity.name}OrderByInput`)
  class DynamicOrderByInput {}

  typeRegistryOrder.set(entityName, DynamicOrderByInput);

  const columns = getMetadataArgsStorage().columns.filter(
    (col) => col.target === entity
  );
  const relations = getMetadataArgsStorage().relations.filter(
    (rel) => rel.target === entity
  ) as any;

  columns.forEach((column) => {
    const propertyName = column.propertyName;
    Field(() => SortEnum, { nullable: true })(
      DynamicOrderByInput.prototype,
      propertyName
    );
  });

  relations.forEach((relation) => {
    const propertyName = relation.propertyName;
    const relationEntity = relation.type();
    const relationOrderByInput = CreateOrderByInputType(relationEntity);
    Field(() => [relationOrderByInput], { nullable: true })(
      DynamicOrderByInput.prototype,
      propertyName
    );
  });

  typeRegistryOrder.set(entityName, DynamicOrderByInput);

  return DynamicOrderByInput;
}

export function CreatePaginatedResponse<T>(entity: Type<T>): Type<any> {
  @ObjectType(`${entity.name}PaginatedResponse`)
  class DynamicPaginatedResponse {
    @Field(() => [entity])
    items: T[];

    @Field(() => PaginationInfo)
    pageInfo: PaginationInfo;
  }

  return DynamicPaginatedResponse;
}

export function CreateGroupByInputType<T>(entity: Type<T>): Type<any> {
  const columns = getMetadataArgsStorage().columns.filter(
    (col) => col.target === entity
  );
  const groupByEnum = generateGroupByEnum(
    entity,
    `${entity.name}GroupByFieldsEnum`
  );
  //console.log('groupByEnum', groupByEnum);

  @InputType(`${entity.name}GroupByInput`)
  class DynamicGroupByInput {}

  // Dynamically add fields to the input type
  Object.keys(groupByEnum).forEach((key) => {
    Field(() => ID, { nullable: true })(DynamicGroupByInput.prototype, key);
  });

  return DynamicGroupByInput;
}

@Scalar("DateTime", () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = "DateTime custom scalar type";

  parseValue(value: string): Date {
    return new Date(value); // value from the client input variables
  }

  serialize(value: Date): string {
    // value sent to the client
    const timeZone = process.env.TIMEZONE || "Asia/Jakarta";
    const zonedDate = toZonedTime(value, timeZone);
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss");
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}

@Scalar("GroupByInput")
export class GroupByInputScalar implements CustomScalar<string, any> {
  description = "Custom scalar type for dynamic groupBy input";

  parseValue(value: any): any {
    return value; // value from the client
  }

  serialize(value: any): any {
    return value; // value sent to the client
  }

  parseLiteral(ast: ValueNode): any {
    if (ast.kind === Kind.OBJECT) {
      const value = Object.create(null);
      ast.fields.forEach((field) => {
        value[field.name.value] = field.value;
      });
      return value;
    }
    return null;
  }
}

export { createDynamicWhereInput as CreateWhereType };
