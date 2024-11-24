import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricsByAlumnComponent } from './rubrics-by-alumn.component';

describe('RubricsByAlumnComponent', () => {
  let component: RubricsByAlumnComponent;
  let fixture: ComponentFixture<RubricsByAlumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricsByAlumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricsByAlumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
