import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CropperComponent } from 'angular-cropperjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { ProfieService } from '../../profile-services/profie.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-avatar',
  templateUrl: './edit-avatar.component.html',
  styleUrls: ['./edit-avatar.component.scss'],
})
export class EditAvatarComponent implements OnInit {
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  avatarDialog: boolean = false;
  public imageUrl: string = '';
  public imageFIle: File;
  cropperResult: string = '';
  public config: any;
  public viewImg: boolean = true;
  loadingImage: boolean = false;
  isFileRejected: boolean = false;
  @Input() data: any;
  userData: any;
  tempImage: any;
  tempUser: any;
  showSelector: boolean = true;
  imageFile: any;

  constructor(
    public http: ProfieService,
    public alerts: AlertsApiService,
    public router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.showSelector = true;
  }

  onHide() {
    this.showSelector = false;
  }

  onShow() {
    this.showSelector = true;
  }

  selectImg(event: any) {
    this.tempUser = Object.assign({}, { ...this.data.image });
    if (event.target.files && event.target.files[0]) {
      const reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        const sizeToMb = (event.target.files[0].size / (1024 * 1024)).toFixed(
          2
        );
        if (Number(sizeToMb) <= 0.99) {
          this.data.cover = null;
          this.imageFile = event.target.files[0];
          this.imageUrl = reader.result as string;
          this.isFileRejected = false;
          this.tempImage = this.imageFile;
        } else {
          this.isFileRejected = true;
        }
      };
    }
  }

  getimgedit() {
    console.log(this.angularCropper);

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
      0.8
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
    this.data.image = this.tempImage;
    this.http
      .sendData(this.data)
      .then((data: any) => {
        this.alerts.succes(
          this.translateService.instant('profile.updatesuccess')
        );
        this.load();
        this.loadingImage = false;
      })
      .catch((error) => {
        this.data.image = this.tempUser;
        const parseError = JSON.parse(error);
        this.alerts.error(parseError);
        this.loadingImage = false;
      });
  }

  load() {
    window.location.reload();
  }

  resetFile(): void {
    this.avatarDialog = false;
  }
}
