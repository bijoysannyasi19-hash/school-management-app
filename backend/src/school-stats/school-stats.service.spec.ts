import { Test, TestingModule } from '@nestjs/testing';
import { SchoolStatsService } from './school-stats.service';

describe('SchoolStatsService', () => {
  let service: SchoolStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolStatsService],
    }).compile();

    service = module.get<SchoolStatsService>(SchoolStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
