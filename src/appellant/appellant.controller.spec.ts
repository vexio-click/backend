import { Test, TestingModule } from '@nestjs/testing';
import { AppellantController } from './appellant.controller';

describe('AppellantController', () => {
  let controller: AppellantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppellantController],
    }).compile();

    controller = module.get<AppellantController>(AppellantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
