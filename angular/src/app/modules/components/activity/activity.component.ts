import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-activity-component',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  @Input() loading: boolean = true;
  @Input() loadingScroll: boolean = true;
  @Input() list: any[] = [];
  @Input() seeAllActivities: boolean = false;
  @Output() seeMoreActivities: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  @Output() showAllActivities: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}

  onScroll() {
    this.seeMoreActivities.emit(true);
  }
}
