import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingTeacherComponent } from './assing-teacher.component';

describe('AssingTeacherComponent', () => {
  let component: AssingTeacherComponent;
  let fixture: ComponentFixture<AssingTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssingTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssingTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
