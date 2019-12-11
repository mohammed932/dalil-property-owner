import { TestBed } from '@angular/core/testing';
import { HttpProductService } from './product.service';

describe('HttpProductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpProductService = TestBed.get(HttpProductService);
    expect(service).toBeTruthy();
  });
});
