import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePaysComponent } from './table-pays.component';

describe('TablePaysComponent', () => {
  let component: TablePaysComponent;
  let fixture: ComponentFixture<TablePaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablePaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
