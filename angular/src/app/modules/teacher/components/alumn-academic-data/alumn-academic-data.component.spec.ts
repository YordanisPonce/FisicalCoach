import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnAcademicDataComponent } from './alumn-academic-data.component';

describe('AlumnAcademicDataComponent', () => {
  let component: AlumnAcademicDataComponent;
  let fixture: ComponentFixture<AlumnAcademicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnAcademicDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnAcademicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
