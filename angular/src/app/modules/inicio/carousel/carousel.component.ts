import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Banner } from 'src/app/_models/general';
import { GeneralService } from 'src/app/_services/general.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
  sub$ = new Subscription();
  bannerData: Banner[];
  loading: boolean = false;

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.getBanners();
  }

  getBanners(): void {
    this.loading = true;
    this.sub$ = this.generalService.getBannerData().subscribe((res) => {
      this.bannerData = res.data;

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.sub$) this.sub$.unsubscribe();
  }
}
