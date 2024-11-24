import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpackegeDetailComponent } from './subpackege-detail.component';

describe('SubpackegeDetailComponent', () => {
  let component: SubpackegeDetailComponent;
  let fixture: ComponentFixture<SubpackegeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubpackegeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpackegeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
