import { TestBed } from '@angular/core/testing';

import { ResourceServiceService } from './resource-service.service';

describe('ResourceServiceService', () => {
  let service: ResourceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
