import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysiotherapyDetailsComponent } from './physiotherapy-details.component';

describe('PhysiotherapyDetailsComponent', () => {
  let component: PhysiotherapyDetailsComponent;
  let fixture: ComponentFixture<PhysiotherapyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysiotherapyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysiotherapyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
