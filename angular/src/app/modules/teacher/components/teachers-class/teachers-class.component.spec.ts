import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersClassComponent } from './teachers-class.component';

describe('TeachersClassComponent', () => {
  let component: TeachersClassComponent;
  let fixture: ComponentFixture<TeachersClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeachersClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
