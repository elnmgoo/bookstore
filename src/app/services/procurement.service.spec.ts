import { TestBed } from '@angular/core/testing';

import { ProcurementService } from './procurement.service';

describe('ProcurementService', () => {
  let service: ProcurementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcurementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
