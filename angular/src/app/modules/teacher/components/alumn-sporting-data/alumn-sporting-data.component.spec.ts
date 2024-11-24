import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnSportingDataComponent } from './alumn-sporting-data.component';

describe('AlumnSportingDataComponent', () => {
  let component: AlumnSportingDataComponent;
  let fixture: ComponentFixture<AlumnSportingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnSportingDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnSportingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
