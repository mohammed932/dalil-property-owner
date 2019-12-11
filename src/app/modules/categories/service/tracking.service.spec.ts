import { TestBed } from '@angular/core/testing';

import { TrackingService } from './transfer.service';

describe('TrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackingService = TestBed.get(TrackingService);
    expect(service).toBeTruthy();
  });
});
