import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompeticionDetailsComponent } from './competicion-details.component';

describe('CompeticionDetailsComponent', () => {
  let component: CompeticionDetailsComponent;
  let fixture: ComponentFixture<CompeticionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompeticionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompeticionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
