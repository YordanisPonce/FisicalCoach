import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReeducacionRfdComponent } from './reeducacion-rfd.component';

describe('ReeducacionRfdComponent', () => {
  let component: ReeducacionRfdComponent;
  let fixture: ComponentFixture<ReeducacionRfdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReeducacionRfdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReeducacionRfdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
