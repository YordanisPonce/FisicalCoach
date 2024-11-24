import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCompeticionDialogComponent } from './crear-competicion-dialog.component';

describe('CrearCompeticionDialogComponent', () => {
  let component: CrearCompeticionDialogComponent;
  let fixture: ComponentFixture<CrearCompeticionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearCompeticionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCompeticionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
