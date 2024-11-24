import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryProfileComponent } from './injury-profile.component';

describe('InjuryProfileComponent', () => {
  let component: InjuryProfileComponent;
  let fixture: ComponentFixture<InjuryProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
