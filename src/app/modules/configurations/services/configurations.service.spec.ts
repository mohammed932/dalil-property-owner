import { TestBed } from '@angular/core/testing';

import { HttpConfigurationsService } from './configurations.service';

describe('HttpClipperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpClipperService = TestBed.get(HttpConfigurationsService);
    expect(service).toBeTruthy();
  });
});
