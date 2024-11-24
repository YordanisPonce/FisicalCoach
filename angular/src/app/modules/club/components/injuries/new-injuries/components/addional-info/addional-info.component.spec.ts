import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddionalInfoComponent } from './addional-info.component';

describe('AddionalInfoComponent', () => {
  let component: AddionalInfoComponent;
  let fixture: ComponentFixture<AddionalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddionalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
