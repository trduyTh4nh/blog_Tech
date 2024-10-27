import { Test, TestingModule } from '@nestjs/testing';
import { ImageRestService } from './image-rest.service';

describe('ImageRestService', () => {
  let service: ImageRestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageRestService],
    }).compile();

    service = module.get<ImageRestService>(ImageRestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
