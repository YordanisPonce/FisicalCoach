import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySuscriptionDialogComponent } from './my-suscription-dialog.component';

describe('MySuscriptionDialogComponent', () => {
  let component: MySuscriptionDialogComponent;
  let fixture: ComponentFixture<MySuscriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySuscriptionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySuscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
