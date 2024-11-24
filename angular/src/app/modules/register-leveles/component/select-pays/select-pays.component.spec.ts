import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaysComponent } from './select-pays.component';

describe('SelectPaysComponent', () => {
  let component: SelectPaysComponent;
  let fixture: ComponentFixture<SelectPaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
