import {
  Component,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { CropperComponent } from 'angular-cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
})
export class ImageCropperComponent implements OnInit {
  @ViewChild('angularCropper') private angularCropper: CropperComponent;

  @Input() coverDialog: boolean = false;
  @Output() close = new EventEmitter<boolean>(false);
  @Output() sendImage = new EventEmitter<any>();

  imageUrl: string = '';
  imageFile: File;
  cropperResult: string = '';
  config: any = {
    viewMode: 3,
  };
  viewImg: boolean = true;
  isFileRejected: boolean = false;

  tempImage: any;
  showSelector: boolean = true;

  constructor() {}

  ngOnInit(): void {
    console.log('coverDialog', this.coverDialog);
    
  }

  selectImg(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader: any = new FileReader();
      const sizeToMb = (event.target.files[0].size / (1024 * 1024)).toFixed(2);

      if (Number(sizeToMb) <= 0.99) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
          this.imageFile = event.target.files[0];
          this.imageUrl = reader.result as string;
          this.tempImage = this.imageFile;

          this.isFileRejected = false;
          this.showSelector = true;
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
          this.tempImage = new File([blob], this.imageFile.name, {
            type: 'image/png',
          });
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
    this.sendImage.emit(this.tempImage);
  }

  onHide() {
    this.showSelector = false;

    this.resetFile();
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
    this.close.emit(false);
  }
}
