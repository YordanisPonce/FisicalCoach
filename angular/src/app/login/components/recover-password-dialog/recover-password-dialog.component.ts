import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ServicesService } from '../../services.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'recover-password-dialog',
  templateUrl: './recover-password-dialog.component.html',
  styleUrls: ['./recover-password-dialog.component.scss']
})
export class RecoverPasswordDialogComponent implements OnInit {
  public email: string = ""
  public loading = false
  constructor(public http: ServicesService, private alert: AlertsApiService, private translate: TranslateService) { }

  @Input() visible: boolean = false
  @Output() close = new EventEmitter<boolean>()
  step: number = 1;


  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false)
  }

  ngOnInit(): void {

  }

  sendData() {
    this.loading = true
    if (this.step === 1)
    {

      const toLower = this.email.toLowerCase();

      this.http.recuperatePass(toLower).subscribe((data: any) => {
        this.loading = false
        this.step = 2;
      }, ({ error }) => {
        this.loading = false
        this.alert.error(error)
      })
    } else
    {
      this.loading = false
      this.closeDialog()
    }

  }

}
