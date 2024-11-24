import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubHomeComponent } from './teamhome.component';

describe('TeamhomeComponent', () => {
  let component: ClubHomeComponent;
  let fixture: ComponentFixture<ClubHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
