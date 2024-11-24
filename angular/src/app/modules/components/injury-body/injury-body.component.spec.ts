import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryBodyComponent } from './injury-body.component';

describe('InjuryBodyComponent', () => {
  let component: InjuryBodyComponent;
  let fixture: ComponentFixture<InjuryBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
