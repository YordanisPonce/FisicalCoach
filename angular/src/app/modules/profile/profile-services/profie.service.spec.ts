import { TestBed } from '@angular/core/testing';

import { ProfieService } from './profie.service';

describe('ProfieService', () => {
  let service: ProfieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
