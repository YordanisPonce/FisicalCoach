import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryPreventionComponent } from './injury-prevention.component';

describe('InjuryPreventionComponent', () => {
  let component: InjuryPreventionComponent;
  let fixture: ComponentFixture<InjuryPreventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryPreventionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryPreventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
