import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLevelesComponent } from './register-leveles.component';

describe('RegisterLevelesComponent', () => {
  let component: RegisterLevelesComponent;
  let fixture: ComponentFixture<RegisterLevelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterLevelesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLevelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
