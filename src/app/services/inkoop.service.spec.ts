import { TestBed } from '@angular/core/testing';

import { InkoopService } from './inkoop.service';

describe('InkoopService', () => {
  let service: InkoopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InkoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
