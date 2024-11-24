import { TestBed } from '@angular/core/testing';

import { AlertsApiService } from './alerts-api.service';

describe('AlertsApiService', () => {
  let service: AlertsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
