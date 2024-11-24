import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from '../../../../../stateManagement/appState.service';
import { AlumnProfileComponent } from '../alumn-profile.component';

@Component({
  selector: ' app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit, OnDestroy {
  subsAlumn: Subscription;
  alumn: any;
  paths = [
    { path: '/teacher/daily-check', name: 'daily_control' },
    { path: '/teacher/evaluation', name: 'evaluation' },
    { path: '/teacher/calification', name: 'calification' },
    { path: '/teacher/tutor', name: 'tutor' },
    { path: '/club/test', name: 'test' },
  ];
  imgUrl: string = environment.images;
  girlAlumnImage: string = this.imgUrl + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.imgUrl + 'images/alumn/alumno.svg';
  injuriesImagesUrl: string | string[];

  constructor(
    private alumnService: AlumnsService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
    private main: AlumnProfileComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subsAlumn = this.alumnService.alumn$.subscribe((data: any) => {
      this.alumn = data;
      this.paths[1].path = `/teacher/alumns/profile/${this.alumn?.alumn?.id}/evaluation`;
      this.paths[3].path = `/teacher/tutor/record/${this.alumn?.alumn?.id}`;
      this.paths[4].path = `/club/test-details/${this.alumn?.alumn?.id}`;
      if (data.alumn) {
        this.injuriesImagesUrl = this.mapInjuryImages(data.injuries_history);
      }
    });
    this.getAlumnData();
  }

  getAlumnData() {
    this.main.getAlumnData();
  }

  getCompetenceKey(key: string, abbr?: boolean) {
    if (key == 'POR EVALUAR' || key == 'UNRATED') {
      return;
    }
    const SPLIT_KEY = key.split('(');
    const ABBR = SPLIT_KEY[1].split(')')[0];
    if (abbr) {
      return ABBR;
    } else {
      return SPLIT_KEY[0];
    }
  }

  mapInjuryImages(injuryRecord: any) {
    const injuriesImages = injuryRecord.map(
      (injury: any) => injury.severity_location.image.full_url
    );
    return injuriesImages;
  }

  ngOnDestroy() {
    this.subsAlumn.unsubscribe();
  }
}
