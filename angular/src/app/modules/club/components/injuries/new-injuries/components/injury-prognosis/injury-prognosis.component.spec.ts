import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryPrognosisComponent } from './injury-prognosis.component';

describe('InjuryPrognosisComponent', () => {
  let component: InjuryPrognosisComponent;
  let fixture: ComponentFixture<InjuryPrognosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryPrognosisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryPrognosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
