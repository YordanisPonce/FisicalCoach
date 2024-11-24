import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubComponent } from './team.component';

describe('TeamComponent', () => {
  let component: ClubComponent;
  let fixture: ComponentFixture<ClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
