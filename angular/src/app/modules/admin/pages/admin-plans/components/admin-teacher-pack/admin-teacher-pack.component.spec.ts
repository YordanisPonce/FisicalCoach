import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTeacherPackComponent } from './admin-teacher-pack.component';

describe('AdminTeacherPackComponent', () => {
  let component: AdminTeacherPackComponent;
  let fixture: ComponentFixture<AdminTeacherPackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTeacherPackComponent]
    });
    fixture = TestBed.createComponent(AdminTeacherPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
