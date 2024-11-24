import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloBaseComponent } from './modulo-base.component';

describe('ModuloBaseComponent', () => {
  let component: ModuloBaseComponent;
  let fixture: ComponentFixture<ModuloBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
