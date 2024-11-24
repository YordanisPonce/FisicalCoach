import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAlumnComponent } from './new-alumn.component';

describe('NewAlumnComponent', () => {
  let component: NewAlumnComponent;
  let fixture: ComponentFixture<NewAlumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAlumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAlumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
