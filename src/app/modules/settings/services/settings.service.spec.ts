import { TestBed } from '@angular/core/testing';

import { HttpSettingsService } from './settings.service';

describe('HttpSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpSettingsService = TestBed.get(HttpSettingsService);
    expect(service).toBeTruthy();
  });
});
