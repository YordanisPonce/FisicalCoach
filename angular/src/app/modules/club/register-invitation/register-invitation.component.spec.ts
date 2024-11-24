import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterInvitationComponent } from './register-invitation.component';

describe('RegisterInvitationComponent', () => {
  let component: RegisterInvitationComponent;
  let fixture: ComponentFixture<RegisterInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterInvitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
