import { Resolver } from "@nestjs/graphql";
import { createGenericResolver } from "../generic/generic.resolver";
import { TImage } from "src/entities/timage";
import { TImageDTO } from "src/dto/TImageDTO";

@Resolver()
export class ImageResolver extends createGenericResolver<TImage>(
  TImageDTO,
  TImage
) {}
