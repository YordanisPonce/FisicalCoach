import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Test, TestSubType, TestType } from 'src/app/_models/test';
import { TestService } from 'src/app/_services/test.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-sub-type-dialog',
  templateUrl: './test-sub-type-dialog.component.html',
  styleUrls: ['./test-sub-type-dialog.component.scss'],
})
export class TestSubTypeDialogComponent implements OnInit {
  constructor(
    public msg: AlertsApiService,
    private testService: TestService,
    private translate: TranslateService
  ) {}

  @Input() visible: boolean = false;
  @Input() test: Partial<TestType> | null;
  @Input() subTypeList: TestSubType[];
  @Output() close = new EventEmitter<boolean>();
  @Output() selectedSubTypeList = new EventEmitter<any>();
  @Output() selectedSubType = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<boolean>();

  urlBase = environment.images;
  subs = new Subscription();
  loadingTests: boolean = false;
  selected: TestSubType;

  getScreenWidth(): any {
    return screen.width;
  }

  closeDialog() {
    this.close.emit(false);
  }

  ngOnInit(): void {}

  /**
   * select sub type
   */
  selectSubType(subType: TestSubType): void {
    this.loadingTests = true;
    this.selected = subType;

    this.subs = this.testService.getTestsBySubType(subType.code).subscribe(
      (res) => {
        if (res.success) {
          if (res.data.length > 0) {
            this.selectedSubTypeList.emit(res.data);
            this.selectedSubType.emit(this.selected);
            this.nextStep.emit(true);
            this.closeDialog();
          } else {
            this.translate.get('testEmpty').subscribe((res) => {
              this.msg.error(res);
            });
          }
        }

        this.loadingTests = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
