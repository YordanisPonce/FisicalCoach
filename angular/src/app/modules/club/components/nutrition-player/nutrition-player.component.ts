import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NutritionService } from 'src/app/_services/nutrition.service';
import { saveAs } from 'file-saver';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { environment } from '../../../../../environments/environment';
import { CarouselPageEvent } from 'primeng/carousel';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nutrition-player',
  templateUrl: './nutrition-player.component.html',
  styleUrls: ['./nutrition-player.component.scss'],
})
export class NutritionPlayerComponent implements OnInit {
  nutritionId: string;
  loading: boolean = false;
  loadingPDFS: boolean = false;
  loadingSinglePDF: boolean = false;
  playerSheets: any[] = [];
  currentIndex: number = 0;
  team: any;
  player: any;
  urlImages = environment.images;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appStateService: AppStateService,
    private nutritionalService: NutritionService,
    private msg: AlertsApiService,
    private location: Location
  ) {}

  get urlImage() {
    if (this.playerSheets) {
      return this.playerSheets[this.currentIndex]?.player?.image_id?.url ||
        this.playerSheets[this.currentIndex]?.player?.gender?.id === 2
        ? '/assets/img/chica.png'
        : '/assets/img/chico.png';
    } else {
      return this.player?.player?.image_id?.url ||
        this.player?.player?.gender?.id === 2
        ? '/assets/img/chica.png'
        : '/assets/img/chico.png';
    }
  }

  get isData() {
    return this.playerSheets.length > 0;
  }

  geturlImage(player: any) {
    if (player.player.image?.full_url) {
      return player.player.image.full_url;
    } else {
      const genderUrl =
        player?.gender === 'female'
          ? this.urlImages + 'images/player/girl.svg'
          : this.urlImages + 'images/player/boy.svg';
      return genderUrl;
    }
  }

  ngOnInit(): void {
    const getId = this.route.snapshot.paramMap.get('id');
    this.nutritionId = getId || '';
    this.getNutritionalSheet(getId);
    this.team = this.appStateService.getTeam();
    this.player = this.appStateService.getPlayer();
  }

  /**
   * download pfd reports
   */
  downloadAllReports(playerId: number): void {
    this.loadingPDFS = true;
    this.nutritionalService.downloadReports(playerId).subscribe(
      (res: any) => {
        const blob = new Blob([res as any], { type: 'application/pdf' });
        saveAs(
          blob,
          `${this.playerSheets[0].player.full_name}-nutritional-sheets.pdf`
        );
        this.loadingPDFS = false;
      },
      ({ error }: any) => {
        this.msg.error(error);
        this.loadingPDFS = false;
      }
    );
  }

  /**
   * download pdf report by id
   */
  downloadPdfById(id: number): void {
    this.loadingSinglePDF = true;
    this.nutritionalService.downloadReportById(id).subscribe(
      (res: any) => {
        const blob = new Blob([res as any], { type: 'application/pdf' });
        saveAs(
          blob,
          `${this.playerSheets[0].player.full_name}-nutritional-sheet.pdf`
        );
        this.loadingSinglePDF = false;
      },
      ({ error }: any) => {
        this.msg.error(error);
        this.loadingSinglePDF = false;
      }
    );
  }

  /***
   * parse int value
   */
  parseValue(str: string): string {
    return parseInt(str).toFixed(1);
  }

  /**
   * get carousel index
   * @param index
   */
  getPageIndex(index: CarouselPageEvent): void {
    this.currentIndex = index.page as number;
  }

  /**
   * Get nutrition sheet
   * @param id
   */
  getNutritionalSheet(id: string | null): void {
    this.loading = true;
    if (id) {
      this.nutritionalService
        .getPlayerNutritionalSheetsById(id as any)
        .subscribe(
          (res) => {
            this.playerSheets = res.data;

            if (res.data.length === 0) {
              this.location.back();
            }
            this.loading = false;
          },
          ({ error }) => {
            if (!error.success) {
              this.msg.error(error.message);
              setTimeout(() => {
                this.location.back();
              }, 2000);
            }
          }
        );
    }
  }
}
