import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseballBoardComponent } from './baseball-board.component';

describe('BaseballBoardComponent', () => {
  let component: BaseballBoardComponent;
  let fixture: ComponentFixture<BaseballBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseballBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseballBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
