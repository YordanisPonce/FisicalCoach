import { TestBed } from '@angular/core/testing';

import { ValidateFormsService } from './validate-forms.service';

describe('ValidateFormsService', () => {
  let service: ValidateFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
