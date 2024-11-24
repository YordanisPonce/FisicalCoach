import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPlayerListComponent } from './test-player-list.component';

describe('TestPlayerListComponent', () => {
  let component: TestPlayerListComponent;
  let fixture: ComponentFixture<TestPlayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestPlayerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPlayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
