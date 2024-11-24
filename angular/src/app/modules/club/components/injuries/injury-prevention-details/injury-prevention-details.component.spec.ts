import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryPreventionDetailsComponent } from './injury-prevention-details.component';

describe('InjuryPreventionDetailsComponent', () => {
  let component: InjuryPreventionDetailsComponent;
  let fixture: ComponentFixture<InjuryPreventionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryPreventionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryPreventionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
