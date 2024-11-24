import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompeticionComponent } from './competicion.component';

describe('CompeticionComponent', () => {
  let component: CompeticionComponent;
  let fixture: ComponentFixture<CompeticionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompeticionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompeticionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
