import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSportPackComponent } from './admin-sport-pack.component';

describe('AdminSportPackComponent', () => {
  let component: AdminSportPackComponent;
  let fixture: ComponentFixture<AdminSportPackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSportPackComponent]
    });
    fixture = TestBed.createComponent(AdminSportPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
