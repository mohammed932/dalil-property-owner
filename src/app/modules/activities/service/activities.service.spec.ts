import { TestBed } from '@angular/core/testing';
import { HttpActivitiesService } from './activities.service';

describe('HttpActivitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpActivitiesService = TestBed.get(HttpActivitiesService);
    expect(service).toBeTruthy();
  });
});
