import { Test, TestingModule } from '@nestjs/testing';
import { LostFoundController } from './lost-found.controller';

describe('LostFoundController', () => {
  let controller: LostFoundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LostFoundController],
    }).compile();

    controller = module.get<LostFoundController>(LostFoundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
