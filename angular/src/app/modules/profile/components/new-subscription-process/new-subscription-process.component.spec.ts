import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubscriptionProcessComponent } from './new-subscription-process.component';

describe('NewSubscriptionProcessComponent', () => {
  let component: NewSubscriptionProcessComponent;
  let fixture: ComponentFixture<NewSubscriptionProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubscriptionProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubscriptionProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
