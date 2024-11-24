import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSecondarySidebarComponent } from './admin-secondary-sidebar.component';

describe('AdminSecondarySidebarComponent', () => {
  let component: AdminSecondarySidebarComponent;
  let fixture: ComponentFixture<AdminSecondarySidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSecondarySidebarComponent]
    });
    fixture = TestBed.createComponent(AdminSecondarySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
