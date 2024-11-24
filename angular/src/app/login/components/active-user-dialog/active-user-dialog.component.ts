import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ServicesService } from '../../services.service';

@Component({
  selector: 'active-user-dialog',
  templateUrl: './active-user-dialog.component.html',
  styleUrls: ['./active-user-dialog.component.scss'],
})
export class ActiveUserDialogComponent implements OnInit {
  public loading = false;
  @Input() visible: boolean = false;
  @Input() email: string = '';
  @Input() msg: string = '';
  @Output() close = new EventEmitter<boolean>();
  step: number = 1;

  constructor(
    public servicesService: ServicesService,
    private alert: AlertsApiService
  ) {}

  closeDialog() {
    this.close.emit(false);
  }

  ngOnInit(): void {}

  sendData() {
    this.loading = true;
    if (this.step === 1) {
      const email = this.email.toLowerCase();
      this.servicesService.activeUser(email).subscribe(
        (data: any) => {
          this.loading = false;
          this.step = 2;
        },
        ({ error }) => {
          this.loading = false;
          this.alert.error(error);
        }
      );
    } else {
      this.loading = false;
      this.closeDialog();
      this.step = 1;
    }
  }
}
