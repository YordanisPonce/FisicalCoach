import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPackageComponent } from './checkout-package.component';

describe('CheckoutPackageComponent', () => {
  let component: CheckoutPackageComponent;
  let fixture: ComponentFixture<CheckoutPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
