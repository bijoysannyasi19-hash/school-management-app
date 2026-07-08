import { Test, TestingModule } from '@nestjs/testing';
import { LostFoundService } from './lost-found.service';

describe('LostFoundService', () => {
  let service: LostFoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LostFoundService],
    }).compile();

    service = module.get<LostFoundService>(LostFoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
