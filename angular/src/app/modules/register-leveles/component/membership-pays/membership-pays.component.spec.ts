import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPaysComponent } from './membership-pays.component';

describe('MembershipPaysComponent', () => {
  let component: MembershipPaysComponent;
  let fixture: ComponentFixture<MembershipPaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipPaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipPaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
