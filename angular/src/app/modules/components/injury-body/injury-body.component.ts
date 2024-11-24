import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import mergeImages from 'merge-images';
import { resourcesUrl } from 'src/app/utils/resources';

const { Canvas, Image } = require('canvas');

@Component({
  selector: 'injury-body',
  templateUrl: './injury-body.component.html',
  styleUrls: ['./injury-body.component.scss'],
})
export class InjuryBodyComponent implements OnInit {
  @Input() injuryImage: any;

  imagePreview: string;

  constructor() {}

  ngOnInit(): void {
    if (this.injuryImage === undefined) {
      this.setInjuryImage();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.injuryImage && changes.injuryImage.currentValue != undefined) {
      const images = changes.injuryImage.currentValue;
      this.setInjuryImage(images);
    }
  }

  getImagesToMerge(images?: string | string[]) {
    let bodyImages = [
      `${resourcesUrl}/images/injuries/body_back.png`,
      `${resourcesUrl}/images/injuries/body_front.png`,
    ];
    let imagesToMerge: any;
    if (!images) {
      return bodyImages;
    } else {
      if (typeof images === 'string') {
        bodyImages.push(images);
        return bodyImages;
      } else {
        imagesToMerge = [...bodyImages, ...(images as [])];
        return imagesToMerge;
      }
    }
  }

  setInjuryImage(images?: string | string[]) {
    mergeImages(this.getImagesToMerge(images), {
      Canvas: Canvas,
      Image: Image,
      crossOrigin: 'anonymous',
    }).then((b64: any) => {
      this.imagePreview = b64;
    });
  }
}
