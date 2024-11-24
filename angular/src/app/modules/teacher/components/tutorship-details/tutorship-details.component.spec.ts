import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorshipDetailsComponent } from './tutorship-details.component';

describe('TutorshipDetailsComponent', () => {
  let component: TutorshipDetailsComponent;
  let fixture: ComponentFixture<TutorshipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorshipDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorshipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
