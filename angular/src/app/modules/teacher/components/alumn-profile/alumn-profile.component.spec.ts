import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnProfileComponent } from './alumn-profile.component';

describe('AlumnProfileComponent', () => {
  let component: AlumnProfileComponent;
  let fixture: ComponentFixture<AlumnProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
