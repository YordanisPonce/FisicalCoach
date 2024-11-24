import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorshipsRecordComponent } from './tutorships-record.component';

describe('TutorshipsRecordComponent', () => {
  let component: TutorshipsRecordComponent;
  let fixture: ComponentFixture<TutorshipsRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorshipsRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorshipsRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
