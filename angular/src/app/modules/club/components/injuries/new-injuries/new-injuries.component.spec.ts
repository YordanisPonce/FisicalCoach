import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInjuriesComponent } from './new-injuries.component';

describe('NewInjuriesComponent', () => {
  let component: NewInjuriesComponent;
  let fixture: ComponentFixture<NewInjuriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewInjuriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInjuriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
