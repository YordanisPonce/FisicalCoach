import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { Subscription } from 'rxjs';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-player-health-total-injuries',
  templateUrl: './player-health-total-injuries.component.html',
  styleUrls: ['./player-health-total-injuries.component.scss'],
})
export class PlayerHealthTotalInjuriesComponent implements OnInit {
  subscription: Subscription;
  role: 'teacher' | 'sport';
  person: any;
  urlBase = environment.images;
  girlAlumnImage: string = this.urlBase + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.urlBase + 'images/alumn/alumno.svg';
  selectedInjuryImage: any;
  riskCalculator: boolean = false;
  injuryRiskId: number | null = null;
  injuriesImages: string[];
  @Input() injuriesHistory: any;
  @Input() injuriesBySeverity: any;
  @Input() injuriesByType: any;
  @Input() injuryRisk: any;
  @Input() totalInjuries: any;
  @Output() showInjury: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private alumnsService: AlumnsService,
    private appStateQuery: AppStateQuery
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as 'teacher' | 'sport';
    const subs =
      this.role === 'teacher'
        ? this.alumnsService.alumn$
        : this.appStateQuery.player$;
    this.subscription = subs.subscribe((res) => {
      this.person = this.role === 'teacher' ? res.alumn : res;
      this.injuryRiskId = this.person?.id;
    });
    this.injuriesImages = this.mapInjuryImages(this.injuriesHistory);

    if (!this.injuryRisk) {
      this.injuryRisk = {
        rank: {},
        total_points: '',
      };
    }
  }

  showLastInjury() {
    this.showInjury.emit(this.injuriesHistory[0].id);
  }

  calculateInjuryRisk() {
    this.riskCalculator = true;
  }

  getImage() {
    console.log(this.person);

    return this.person.image != null
      ? this.person.image.full_url
      : this.person.gender?.code === 'female'
      ? this.girlAlumnImage
      : this.boyAlumnImage;
  }

  getInjuriesBySeverity(severity: string) {
    return this.injuriesHistory.filter(
      (injury: any) => injury.severity.code === severity
    );
  }

  getInjuriesByType(type: string) {
    return this.injuriesHistory.filter(
      (injury: any) => injury.type.code === type
    );
  }

  mapInjuryImages(injuryRecord: any) {
    const injuriesImages = injuryRecord?.map(
      (injury: any) => injury?.severity_location?.image?.full_url
    );
    return injuriesImages;
  }

  showSelectedInjuryImage(injuryImageUrl: string) {
    this.selectedInjuryImage = injuryImageUrl;
  }

  getRankResult(value: any): void {
    this.injuryRisk.rank = value.rank;
    this.injuryRisk.total_points = value.point;
  }
}
