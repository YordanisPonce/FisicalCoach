import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubscripcionComponent } from './update-subscripcion.component';

describe('UpdateSubscripcionComponent', () => {
  let component: UpdateSubscripcionComponent;
  let fixture: ComponentFixture<UpdateSubscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateSubscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSubscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
