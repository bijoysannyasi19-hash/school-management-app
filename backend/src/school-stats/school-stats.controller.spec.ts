import { Test, TestingModule } from '@nestjs/testing';
import { SchoolStatsController } from './school-stats.controller';

describe('SchoolStatsController', () => {
  let controller: SchoolStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolStatsController],
    }).compile();

    controller = module.get<SchoolStatsController>(SchoolStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
