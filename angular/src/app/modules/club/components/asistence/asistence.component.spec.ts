import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenceComponent } from './asistence.component';

describe('AsistenceComponent', () => {
  let component: AsistenceComponent;
  let fixture: ComponentFixture<AsistenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
