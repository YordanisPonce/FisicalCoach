import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RatingIcon } from 'src/app/utils/rating-icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rating-exercise-dialog',
  templateUrl: './rating-exercise-dialog.component.html',
  styleUrls: ['./rating-exercise-dialog.component.scss'],
})
export class RatingExerciseDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() ratingIcons: RatingIcon[];
  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() setRatingValue: EventEmitter<number> = new EventEmitter();

  ratingValue: number = 0;
  resources = environment.images + 'images';

  constructor() {}

  ngOnInit(): void {}

  save(): void {
    this.setRatingValue.emit(this.ratingValue);

    this.close.emit(true);
  }
}
