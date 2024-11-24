import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersInvitationsComponent } from './members-invitations.component';

describe('MembersInvitationsComponent', () => {
  let component: MembersInvitationsComponent;
  let fixture: ComponentFixture<MembersInvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersInvitationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
