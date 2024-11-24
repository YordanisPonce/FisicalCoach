import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUpdateSubscriptionComponent } from './confirm-update-subscription.component';

describe('ConfirmUpdateSubscriptionComponent', () => {
  let component: ConfirmUpdateSubscriptionComponent;
  let fixture: ComponentFixture<ConfirmUpdateSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmUpdateSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUpdateSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
