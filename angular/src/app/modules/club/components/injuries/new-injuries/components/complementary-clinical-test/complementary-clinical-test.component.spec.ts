import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementaryClinicalTestComponent } from './complementary-clinical-test.component';

describe('ComplementaryClinicalTestComponent', () => {
  let component: ComplementaryClinicalTestComponent;
  let fixture: ComponentFixture<ComplementaryClinicalTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplementaryClinicalTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementaryClinicalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
