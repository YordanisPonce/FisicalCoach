import { TestBed } from '@angular/core/testing';

import { NuevoEquipoService } from './nuevo-equipo.service';

describe('NuevoEquipoService', () => {
  let service: NuevoEquipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuevoEquipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
