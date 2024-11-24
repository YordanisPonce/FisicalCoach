import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentAndCauseComponent } from './moment-and-cause.component';

describe('MomentAndCauseComponent', () => {
  let component: MomentAndCauseComponent;
  let fixture: ComponentFixture<MomentAndCauseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomentAndCauseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentAndCauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
