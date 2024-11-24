import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfdLesionesComponent } from './rfd-lesiones.component';

describe('RfdLesionesComponent', () => {
  let component: RfdLesionesComponent;
  let fixture: ComponentFixture<RfdLesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfdLesionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfdLesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
