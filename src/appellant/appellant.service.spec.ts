import { Test, TestingModule } from '@nestjs/testing';
import { AppellantService } from './appellant.service';

describe('AppellantService', () => {
  let service: AppellantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppellantService],
    }).compile();

    service = module.get<AppellantService>(AppellantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
