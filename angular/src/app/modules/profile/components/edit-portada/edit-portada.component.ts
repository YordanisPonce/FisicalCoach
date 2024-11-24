import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CropperComponent } from 'angular-cropperjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ProfieService } from '../../profile-services/profie.service';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../../../stateManagement/appState.service';

@Component({
  selector: 'edit-portada',
  templateUrl: './edit-portada.component.html',
  styleUrls: ['./edit-portada.component.scss'],
})
export class EditPortadaComponent implements OnInit {
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  coverDialog: boolean = false;
  public imageUrl: string = '';
  public imageFile: File;
  cropperResult: string = '';
  public config: any = {
    viewMode: 3,
  };
  public viewImg: boolean = true;
  loadingImage: boolean = false;
  isFileRejected: boolean = false;
  @Input() data: any;
  tempImage: any;
  tempUser: any;
  showSelector: boolean = true;

  constructor(
    public router: Router,
    public http: ProfieService,
    private translateService: TranslateService,
    private appStateService: AppStateService,
    public alerts: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.showSelector = true;
  }

  selectImg(event: any) {
    this.tempUser = Object.assign({}, { ...this.data.cover });
    if (event.target.files && event.target.files[0]) {
      const reader: any = new FileReader();
      const sizeToMb = (event.target.files[0].size / (1024 * 1024)).toFixed(2);
      if (Number(sizeToMb) <= 0.99) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          this.imageFile = event.target.files[0];
          this.imageUrl = reader.result as string;
          this.tempImage = this.imageFile;
          this.data.image = null;
          this.isFileRejected = false;
          this.viewImg = true;
        };
      } else {
        this.isFileRejected = true;
      }
    }
  }

  getimgedit() {
    this.angularCropper.cropper.getCroppedCanvas().toBlob(
      (blob: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          this.viewImg = false;
          this.cropperResult = reader.result as string;
          this.tempImage = blob;
        };
      },
      'image/jpeg',
      1
    );
  }

  undo() {
    this.viewImg = !this.viewImg;
    if (!this.cropperResult) {
      this.showSelector = false;
      setTimeout(() => {
        this.showSelector = true;
      }, 200);
    }
  }

  saveData() {
    this.loadingImage = true;
    this.data.cover = this.tempImage;
    this.http
      .sendData(this.data)
      .then((data: any) => {
        this.alerts.succes(
          this.translateService.instant('profile.updatesuccess')
        );
        this.load();
        this.loadingImage = false;
      })
      .catch((err) => {
        this.data.cover = this.tempUser;
        const errror = JSON.parse(err);
        const msg = errror?.errors?.cover;
        if (msg) {
          this.alerts.error(this.translateService.instant(msg[0]));
        } else {
          this.alerts.error(
            this.translateService.instant('profile.updateerror')
          );
        }
        this.loadingImage = false;
      });
  }

  onHide() {
    this.showSelector = false;
  }

  onShow() {
    this.showSelector = true;
  }

  load() {
    window.location.reload();
  }

  resetFile(): void {
    this.imageUrl = '';
    this.cropperResult = '';
    this.coverDialog = false;
  }
}
