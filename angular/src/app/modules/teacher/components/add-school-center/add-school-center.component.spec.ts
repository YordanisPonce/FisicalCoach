import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchoolCenterComponent } from './add-school-center.component';

describe('AddSchoolCenterComponent', () => {
  let component: AddSchoolCenterComponent;
  let fixture: ComponentFixture<AddSchoolCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSchoolCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSchoolCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
