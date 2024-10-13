import {
  Args,
  Context,
  Field,
  Info,
  InputType,
  Mutation,
  Query,
  Resolver,
  registerEnumType,
} from "@nestjs/graphql";
import { BaseEntity } from "../../entities/BaseEntity";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericDTO } from "./generic.dto";
import { Repository, Brackets } from "typeorm";
import { HttpException, Req, Type, UseGuards } from "@nestjs/common";
import {
  BaseResponse,
  BooleanFilter,
  DateFilter,
  NumberFilter,
  StringFilter,
} from "./whereCondition";
import { getMetadataArgsStorage, SelectQueryBuilder } from "typeorm";
import { RawSqlResultsToEntityTransformer } from "typeorm/query-builder/transformer/RawSqlResultsToEntityTransformer";
import { GraphQLResolveInfo } from "graphql";
import {
  CreateGroupByInputType,
  CreateInputType,
  CreateOrderByInputType,
  CreatePaginatedResponse,
  CreateWhereType,
  PaginationInfo,
  SortEnum,
  generateGroupByEnum,
} from "./extension";
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from "./user.decorator";
import { AuthGuard } from "@nestjs/passport";
function createMutation<T>(entity: any, repository: Repository<T>) {
  return {
    async create(input: any): Promise<T> {
      return await repository.save(input);
    },
  };
}
interface ResolverOptions {
  useMutation?: boolean;
}
// Define a generic resolver
export function createBaseResolver<T>(DTOClass: any, entityName: any) {
  const WhereInputClass = CreateWhereType(entityName);
  const OrderByInputClass = CreateOrderByInputType(entityName);
  const GroupByInputClass = CreateGroupByInputType(entityName);
  const ResponseClass = CreatePaginatedResponse(DTOClass);
  const entityNameString = upperCaseFirstLetter(entityName.name.substring(1));
  const groupByEnum = generateGroupByEnum(
    entityName,
    `${entityNameString}GroupByFieldsEnum`
  );

  // upperCaseFirstLetter
  function upperCaseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  @Resolver(() => DTOClass, { isAbstract: true })
  // @UseGuards(AuthGuard("jwt"))
  abstract class GenericResolver {
    constructor(
      @InjectRepository(entityName)
      readonly repository: Repository<T>
    ) {}

    @Query(() => ResponseClass, { name: `get${entityNameString}` })
    async getData(
      @Args("where", { type: () => WhereInputClass, nullable: true })
      where?: any,
      @Args("skip", { type: () => Number, nullable: true, defaultValue: 0 })
      skip?: number,
      @Args("take", { type: () => Number, nullable: true, defaultValue: 100 })
      take?: number,
      @Args("orderBy", { type: () => [OrderByInputClass], nullable: true })
      orderBy?: any[],
      @Args("groupBy", { type: () => [groupByEnum], nullable: true })
      groupBy?: any,
      @Info() info?: GraphQLResolveInfo
    ): Promise<any> {
      const queryBuilder = this.repository.createQueryBuilder(
        "entity"
      ) as SelectQueryBuilder<T>;

      this.aliasRegistry.clear(); // Clear the alias registry before building the query

      const selections = info?.fieldNodes[0]?.selectionSet?.selections;
      let selectedFields: string[] = [];
      if (selections) {
        selections.forEach((selection: any) => {
          if (selection.name.value === "items") {
            const field = selection;
            //console.log('fields', field);
            this.applyConditionalJoins(
              queryBuilder,
              entityName,
              field,
              "entity",
              4
            ); // Joining up to 3 levels

            selectedFields = this.getSelectedFields(
              field,
              entityName,
              "entity",
              4
            );
            //console.log('selectedFields', selectedFields);
            queryBuilder.select(selectedFields);

            if (
              groupBy &&
              selectedFields.findIndex((f) => f === `entity.id`) === -1
            ) {
              queryBuilder.addSelect("Max(entity.id)", "entity_id");
            }
          }
        });
      }

      if (where) {
        this.applyWhereConditions(queryBuilder, where);
      }

      if (groupBy) {
        const groupByString = groupBy
          .map((field) => `entity.${field}`)
          .join(", ");
        queryBuilder.groupBy(groupByString);
      }

      //console.log('orderBy', orderBy);

      if (orderBy) {
        orderBy.forEach((e) => {
          const fields = Object.keys(e);
          fields.forEach((field) => {
            // check if field is an array
            if (Array.isArray(e[field])) {
              e[field].forEach((item) => {
                const keys = Object.keys(item);
                keys.forEach((key: any) => {
                  const alias = `entity_${field}`;
                  const snakeCaseKey = key
                    .replace(/([A-Z])/g, "_$1")
                    .toLowerCase();
                  const relationAlias = `${alias}_${snakeCaseKey}`;
                  if (!this.aliasRegistry.has(alias)) {
                    queryBuilder.leftJoin(`entity.${field}`, alias);
                    this.aliasRegistry.set(alias, alias);
                  }

                  // check if selected fields are already select
                  if (
                    selectedFields.findIndex((f) => f === `${alias}.${key}`) ===
                    -1
                  ) {
                    queryBuilder.addSelect(
                      `${alias}.${snakeCaseKey}`,
                      `${relationAlias}`
                    );
                  }

                  const orderByDirection = item[key];
                  const orderByField = `entity_${field}.${key}`;
                  queryBuilder.addOrderBy(orderByField, orderByDirection);
                });
              });
            } else {
              const orderByDirection = e[field];
              // check if selected fields are already select
              if (
                selectedFields.findIndex((f) => f === `entity.${field}`) === -1
              ) {
                const snakeCaseField = field
                  .replace(/([A-Z])/g, "_$1")
                  .toLowerCase();
                queryBuilder.addSelect(
                  `entity.${snakeCaseField}`,
                  `entity_${snakeCaseField}`
                );
              }
              queryBuilder.addOrderBy(`entity.${field}`, orderByDirection);
            }
          });
        });
      }
      const totalItems = await queryBuilder.getCount();
      // const totalItems = 0;
      if (skip) {
        if (skip < 0) {
          throw new Error("Skip cannot be negative");
        }
        queryBuilder.skip(skip);
      }

      if (take) {
        if (take > 10000) {
          throw new Error("You can only take 10000 records at a time");
        }
        if (take <= 0) {
          throw new Error("Take must be greater than 0");
        }
        queryBuilder.take(take);
      }

      //console.log('queryBuilder', queryBuilder.getQuery());

      //const items = await queryBuilder.getMany();
      let items = [];

      if (groupBy) {
        const rawItems = await queryBuilder.getRawMany();
        console.log("rawItems", rawItems);

        // Transform rawItems to match the expected return type
        items = rawItems.map((rawItem) => {
          const item = {};
          selectedFields.forEach((field) => {
            //console.log('field', field);
            const alias = field.split(".").pop();
            const entityName = field.split(".")[0];
            const aliasSnakeCase = alias
              .replace(/([A-Z])/g, "_$1")
              .toLowerCase();
            const queryAlias = `${entityName}_${aliasSnakeCase}`;
            const tableName = entityName.replace("entity_", "");
            //console.log('tableName', tableName);
            if (tableName === "entity") {
              item[alias] = rawItem[queryAlias];
            }
          });
          return item;
        });
      } else {
        items = await queryBuilder.getMany();
      }

      //console.log('itemsz', itemsz);
      //const totalItems = await queryBuilder.getCount();
      //const [items, totalItems] = await queryBuilder.getManyAndCount();

      //console.log('items', items);

      const pageSize = take || 100;
      const page = Math.floor(skip / pageSize) + 1;
      const totalPages = Math.ceil(totalItems / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const pageInfo: PaginationInfo = {
        totalItems,
        totalPages,
        itemsPerPage: pageSize,
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
      };

      return { items, pageInfo };
    }

    getSelectedFields(
      info: any,
      entity: any,
      alias: string = "entity",
      depth: number = 1
    ): string[] {
      //const selections = info.selectionSet.selections;
      //console.log('selections', selections);
      const columns = getMetadataArgsStorage().columns.filter(
        (column) => column.target === entity
      );
      const selectedFields: string[] = [];
      const fields = info.selectionSet.selections;
      fields.forEach((field: any) => {
        const fieldName = field.name.value;
        const column = columns.find(
          (column) => column.propertyName === fieldName
        );

        if (column) {
          selectedFields.push(`${alias}.${fieldName}`);
        }

        if (depth > 1) {
          const relations = getMetadataArgsStorage().relations.filter(
            (relation) =>
              relation.target === entity && relation.propertyName === fieldName
          );

          relations.forEach((relation) => {
            const relationAlias = `${alias}_${relation.propertyName}`;
            //console.log('relationAlias', relationAlias);
            selectedFields.push(
              ...this.getSelectedFieldsForRelation(
                field,
                relation,
                relationAlias,
                depth - 1
              )
            );
          });
        }
      });

      return selectedFields;
    }

    getSelectedFieldsForRelation(
      field: any,
      relation: any,
      alias: string,
      depth: number
    ): string[] {
      const relationEntity =
        typeof relation.type === "function" ? relation.type() : relation.type;
      return this.getSelectedFields(field, relationEntity, alias, depth);
    }
    aliasRegistry = new Map<string, string>();
    applyConditionalJoins<T>(
      queryBuilder: SelectQueryBuilder<T>,
      entity: any,
      info: any,
      alias: string = "entity",
      depth: number = 1
    ): void {
      const fields = info?.selectionSet?.selections;

      fields?.forEach((field: any) => {
        const fieldName = field.name.value;
        const relations = getMetadataArgsStorage().relations.filter(
          (relation) =>
            relation.target === entity && relation.propertyName === fieldName
        );

        relations.forEach((relation: any) => {
          const relationAlias = `${alias}_${relation.propertyName}`;

          // Check if this alias has already been joined
          if (!this.aliasRegistry.has(relationAlias)) {
            //console.log('relationAlias', `${alias}.${relation.propertyName}`);
            queryBuilder.leftJoinAndSelect(
              `${alias}.${relation.propertyName}`,
              relationAlias
            );
            this.aliasRegistry.set(relationAlias, relationAlias);

            if (depth > 1) {
              const relationEntity =
                typeof relation.type === "function"
                  ? relation.type()
                  : relation.type;
              this.applyConditionalJoins(
                queryBuilder,
                relationEntity,
                field,
                relationAlias,
                depth - 1
              );
            }
          }
        });
      });
    }

    applyWhereConditions<T>(
      queryBuilder,
      where: any,
      alias: string = "entity"
    ): void {
      if (where.AND) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            where.AND.forEach((subWhere: any) => {
              qb.andWhere(
                new Brackets((subQb) => {
                  this.applyWhereConditions(subQb, subWhere, alias);
                })
              );
            });
          })
        );
      }

      if (where.OR) {
        //console.log('where.OR', where.OR);
        //console.log('alias', alias);
        queryBuilder.andWhere(
          new Brackets((qb) => {
            where.OR.forEach((subWhere: any) => {
              console.log("subWhere", subWhere);
              qb.orWhere(
                new Brackets((subQb: any) => {
                  this.applyWhereConditions(subQb, subWhere, alias);
                })
              );
            });
          })
        );
      }

      if (where.NOT) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            where.NOT.forEach((subWhere) => {
              qb.andWhere(
                new Brackets((subQb) => {
                  this.applyWhereConditions(subQb, subWhere, alias);
                })
              );
            });
          })
        );
      }

      // if (where.NOT) {
      //   queryBuilder.andWhere(
      //     new Brackets((qb) => {
      //       where.NOT.forEach((subWhere: any) => {
      //         qb.andWhere(
      //           new Brackets((subQb: any)  => {
      //             this.applyWhereConditions(subQb, subWhere, alias);
      //           }), 'NOT'
      //         );
      //       });
      //     })
      //   );
      // }

      // let index = 0;
      Object.keys(where).forEach((key) => {
        //index += 1;
        if (key !== "AND" && key !== "OR" && key !== "NOT") {
          const condition = where[key];
          if (
            typeof condition === "object" &&
            condition !== null &&
            !Array.isArray(condition)
          ) {
            // Handle nested conditions for relations
            const relation = getMetadataArgsStorage().relations.find(
              (rel) =>
                rel.target ===
                  queryBuilder.expressionMap.mainAlias!.metadata.target &&
                rel.propertyName === key
            );
            if (relation) {
              const relationAlias = `${alias}_${key}`;
              // Check if this alias has already been joined
              if (!this.aliasRegistry.has(relationAlias)) {
                queryBuilder.leftJoinAndSelect(
                  `${alias}.${key}`,
                  relationAlias
                );
                this.aliasRegistry.set(relationAlias, relationAlias);
              }
              this.applyWhereConditions(queryBuilder, condition, relationAlias);
            } else {
              this.applyCondition(queryBuilder, key, condition, alias);
            }
          } else {
            this.applyCondition(queryBuilder, key, condition, alias);
          }
        }
      });
    }
    applyCondition<T>(
      queryBuilder: SelectQueryBuilder<T>,
      field: string,
      condition: any,
      alias: string
    ): void {
      const operatorMapping = {
        equals: "=",
        not: "!=",
        lt: "<",
        lte: "<=",
        gt: ">",
        gte: ">=",
        in: "IN",
        notIn: "NOT IN",
        contains: "ILIKE",
        startsWith: "ILIKE",
        endsWith: "ILIKE",
        isNull: "IS NULL",
      };

      //console.log('applyCondition', field, condition, alias);

      Object.keys(condition).forEach((key) => {
        const operator = operatorMapping[key];
        const value = condition[key];
        const uniqueId = Math.random().toString(36).substring(7);
        const parameterName = `${alias}_${field}_${key}_${uniqueId}`;

        //console.log('parameterName', parameterName);
        // console.log('value', value);

        if (key === "contains") {
          queryBuilder.andWhere(
            `${alias}.${field} ${operator} :${parameterName}`,
            { [parameterName]: `%${value}%` }
          );
        } else if (key === "startsWith") {
          queryBuilder.andWhere(
            `${alias}.${field} ${operator} :${parameterName}`,
            { [parameterName]: `${value}%` }
          );
        } else if (key === "endsWith") {
          queryBuilder.andWhere(
            `${alias}.${field} ${operator} :${parameterName}`,
            { [parameterName]: `%${value}` }
          );
        } else if (key === "in" || key === "notIn") {
          queryBuilder.andWhere(
            `${alias}.${field} ${operator} (:...${parameterName})`,
            { [parameterName]: value }
          );
        } else if (key === "isNull") {
          queryBuilder.andWhere(`${alias}.${field} ${operator} `);
        } else {
          queryBuilder.andWhere(
            `${alias}.${field} ${operator} :${parameterName}`,
            { [parameterName]: value }
          );
        }
      });
    }
  }

  return GenericResolver;
}

export function createGenericResolver<T>(
  DTOClass: any,
  entityName: any,
  options: ResolverOptions = { useMutation: true }
) {
  const entityNameString = upperCaseFirstLetter(entityName.name.substring(1));
  const InputTypeClass = CreateInputType(entityName);
  // upperCaseFirstLetter
  function upperCaseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (options.useMutation) {
    @Resolver(() => DTOClass, { isAbstract: true })
    // @UseGuards(AuthGuard("jwt"))
    abstract class GenericResolverWithMutations extends createBaseResolver(
      DTOClass,
      entityName
    ) {
      constructor(
        @InjectRepository(entityName)
        readonly repository: Repository<T>
      ) {
        super(repository);
      }
      @Mutation(() => DTOClass, { name: `create${entityNameString}` })
      async create(
        @Args("input", { type: () => InputTypeClass }) input: any,
        @CurrentUser() user: any
      ): Promise<T> {
        // Check if the record already exists
        const id = input.id;

        input.createDate = new Date();
        // input.createId = user.id;
        // input.modifyId = user.id;
        input.modifyDate = new Date();

        if (!id) {
          //throw new Error('ID is required');
          const data = await this.repository.save(input);
          return data;
        }
        const record = await this.repository.findOne({
          where: { id } as any, // Explicitly cast to avoid type issues
        });

        if (record) {
          throw new HttpException(
            `Id ${id} đã tồn tại! Vui lòng tạo lại Id khác.`,
            400
          );
        }

        const data = await this.repository.save(input);
        return data;
      }

      @Mutation(() => [DTOClass], { name: `createMany${entityNameString}` })
      async createMany(
        @Args("input", { type: () => [InputTypeClass] }) input: any[],
        @CurrentUser() user: any
      ): Promise<T[]> {
        const newRecords = [];
        for (const recordInput of input) {
          const id = recordInput.id;
          const date = new Date();
          recordInput.createDate = date;
          recordInput.createId = user.id;
          console.log(date);
          console.log(id);
          if (!id) {
            newRecords.push(recordInput);
          } else {
            const existingRecord = await this.repository.findOne({
              where: { id } as any,
            });
            if (existingRecord) {
              throw new Error(`Id ${id} đã tồn tại! Vui lòng tạo lại Id khác.`);
            }
            newRecords.push(recordInput);
          }
        }
        console.log(newRecords);
        return await this.repository.save(newRecords);
      }

      @Mutation(() => DTOClass, { name: `update${entityNameString}` })
      async update(
        // @Args('id', { type: () => String }) id: string,
        @Args("input", { type: () => InputTypeClass }) input: any,
        @CurrentUser() user: any
      ): Promise<T> {
        const id = input.id;
        // console.log('user', user);
        if (!id) {
          throw new Error("ID is required");
        }

        const record = await this.repository.findOne({
          where: { id } as any, // Explicitly cast to avoid type issues
        });
        if (!record) {
          throw new Error("Record not found");
        }

        // input.modifyDate = new Date();
        // input.modifyId = user.id;

        await this.repository.update(id, input);
        return await this.repository.findOne({
          where: { id } as any, // Explicitly cast to avoid type issues
        });
      }

      @Mutation(() => [DTOClass], { name: `updateMany${entityNameString}` })
      async updateMany(
        @Args("input", { type: () => [InputTypeClass] }) input: any[],
        @CurrentUser() user: any
      ): Promise<T[]> {
        // console.log('user', user);
        const updatedRecords = [];
        for (const recordInput of input) {
          const id = recordInput.id;
          if (!id) {
            throw new Error("ID is required for each item");
          }

          const record = await this.repository.findOne({
            where: { id } as any, // Explicitly cast to avoid type issues
          });
          if (!record) {
            throw new Error(`Record with ID ${id} not found`);
          }

          recordInput.modifyDate = new Date();
          recordInput.modifyId = user.id;

          await this.repository.update(id, recordInput);
          const updatedRecord = await this.repository.findOne({
            where: { id } as any, // Explicitly cast to avoid type issues
          });
          updatedRecords.push(updatedRecord);
        }
        return updatedRecords;
      }

      @Mutation(() => BaseResponse, { name: `delete${entityNameString}` })
      async delete(
        @Args("id", { type: () => String }) id: string
      ): Promise<BaseResponse> {
        const record = await this.repository.findOne({
          where: { id } as any, // Explicitly cast to avoid type issues
        });

        if (!record) {
          return {
            success: false,
            code: "404",
            message: "Record not found",
          };
        }

        await this.repository.delete(id);

        return {
          success: true,
          code: "200",
          message: "Record deleted successfully",
        };
      }
    }
    return GenericResolverWithMutations;
  } else {
    const BaseResolver = createBaseResolver(DTOClass, entityName);
    return BaseResolver;
  }
}
