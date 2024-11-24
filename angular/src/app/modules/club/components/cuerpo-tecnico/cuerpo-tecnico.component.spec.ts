import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuerpoTecnicoComponent } from './cuerpo-tecnico.component';

describe('CuerpoTecnicoComponent', () => {
  let component: CuerpoTecnicoComponent;
  let fixture: ComponentFixture<CuerpoTecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuerpoTecnicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuerpoTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
