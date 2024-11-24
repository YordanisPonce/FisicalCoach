import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryPreventionRecordComponent } from './injury-prevention-record.component';

describe('InjuryPreventionRecordComponent', () => {
  let component: InjuryPreventionRecordComponent;
  let fixture: ComponentFixture<InjuryPreventionRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryPreventionRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryPreventionRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
