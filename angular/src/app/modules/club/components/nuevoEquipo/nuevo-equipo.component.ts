import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/_services/general.service';
import { TeamService } from 'src/app/_services/team.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import HandleErrors from '../../../../utils/errors';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';

@Component({
  selector: 'app-nuevo-equipo',
  templateUrl: './nuevo-equipo.component.html',
  styleUrls: ['./nuevo-equipo.component.scss'],
})
export class NuevoEquipoComponent implements OnInit {
  @Input() visible: boolean;
  @Input() editingTeam: any | null = null;
  @Output() close = new EventEmitter<boolean>();
  @Output() createdTeam = new EventEmitter<any>();

  step: number = 1;
  colors: any = ['#024CAC', '#EF1616', '#A71212', '#050C44', '#00E9C5'];
  color: string;
  customColor: string = '';
  loading: boolean = false;
  submittedForm: boolean = false;
  teamModalities: any = null;
  selectedSport: string = '';
  isFileRejectedBySize: boolean = false;
  isFileRejectedByType: boolean = false;
  newTeamForm = this.formBuilder.group({
    name: ['', Validators.required],
    color: [''],
    category: ['', Validators.required],
    type_id: [''],
    modality_id: [''],
    season_id: ['', Validators.required],
    gender_id: [''],
    image: [''],
    cover: [''],
    sport_id: ['', Validators.required],
    club_id: ['', Validators.required],
  });
  responsiveOptions = [
    {
      breakpoint: '1200px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
  sports: any;
  genders: any;
  teamTypes: any;
  seasons: any;
  prev_element: any = null;
  teamImgPrev: any = '';
  error: HandleErrors = new HandleErrors(this.alertsApiService);
  openCropperDialog: boolean = false;

  constructor(
    private generalService: GeneralService,
    private teamService: TeamService,
    private renderer: Renderer2,
    private formBuilder: UntypedFormBuilder,
    private sanitizer: DomSanitizer,
    private appsStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    public alertsApiService: AlertsApiService,
    private translate: TranslateService,
    private router: Router
  ) {}

  get newTeamControls() {
    return this.newTeamForm.controls;
  }

  validateField(field: string) {
    return this.newTeamForm.get(field)?.invalid;
  }

  validateStepFields(fields: string[]) {
    let invalidFields: boolean = false;
    fields.forEach((field) => {
      if (this.validateField(field)) {
        invalidFields = true;
        this.newTeamForm.get(field)?.markAsTouched({ onlySelf: true });
      }
    });
    if (invalidFields) {
      return true;
    }
  }

  validateStep() {
    let fields = [];
    switch (this.step) {
      case 1:
        fields = ['name', 'sport_id'];
        if (!this.validateStepFields(fields)) {
          this.step = this.step + 1;
        }
        break;
      case 2:
        fields = ['season_id', 'category'];
        if (!this.validateStepFields(fields)) {
          this.step = this.step + 1;
        }
        break;
      default:
        break;
    }
  }

  onSubmit(event: any): void {
    event.preventDefault();
    this.submittedForm = true;
    if (this.newTeamForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.teamService
        .createTeam(
          this.newTeamForm.value,
          this.editingTeam ? this.editingTeam.code : null
        )
        .then((res: any) => {
          const response = JSON.parse(res);
          this.createdTeam.emit(response.data);
          if (this.editingTeam) {
            this.appStateService.updateTeam(response.data);
            this.step = 4;
            this.loading = this.submittedForm = false;
          } else {
            this.getTeam(response.data.code);
            this.newTeamForm.reset();
          }
        })
        .catch((res) => {
          this.error.handleError(
            res,
            this.translate.instant('CLUB.saveerrorteam')
          );
          this.loading = this.submittedForm = false;
        });
    }
  }

  getTeam(code: any) {
    this.teamService.getTeamData(code).subscribe((res) => {
      this.appStateService.updateTeam(res.data);
      this.step = 4;
      this.loading = this.submittedForm = false;
    });
  }

  closeDialog(isRedirect = false) {
    this.newTeamForm.reset();
    this.close.emit(false);
    this.step = 1;
    this.teamImgPrev = '';

    if (isRedirect) {
      this.router.navigate(['/club/home']);
    }
  }

  selectSport(event: any, sport: any) {
    this.newTeamForm.patchValue({ sport_id: sport.id });
    this.selectedSport = sport.code;
    event.preventDefault();
    if (this.prev_element != null) {
      this.renderer.removeClass(this.prev_element, 'selected');
    }

    if (['sport_icon', 'sport_name'].includes(event.target.className)) {
      this.prev_element = event.target.parentNode;
      this.renderer.addClass(event.target.parentNode, 'selected');
    } else {
      this.prev_element = event.target;
      this.renderer.addClass(event.target, 'selected');
    }

    this.teamService
      .getTeamsModality(this.selectedSport)
      .subscribe((data: any) => {
        if (data.data.length > 0) {
          this.teamModalities = data.data;
        } else {
          this.teamModalities = null;
          this.newTeamForm.patchValue({ modality_id: '' });
        }
      });
  }

  onFileSelected(file: File) {
    if (file) {
      const types = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/svg',
        'image/JPEG',
        'image/PNG',
        'image/JPG',
        'image/SVG',
      ];

      const sizeToMb = (file.size / (1024 * 1024)).toFixed(2);
      const isPngType = types.includes(file.type);

      if (parseInt(sizeToMb) <= 0.99 && isPngType) {
        this.isFileRejectedBySize = false;
        this.isFileRejectedByType = false;
        this.newTeamForm.controls.image.setValue(file);
        this.newTeamForm.controls.cover.setValue(file);
        this.teamImgPrev = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );
      } else {
        if (!isPngType) {
          this.isFileRejectedByType = true;
        } else {
          this.isFileRejectedBySize = true;
        }
        this.teamImgPrev = '';
        this.newTeamForm.controls.image.setValue(null);
      }
      this.newTeamForm.controls.image.updateValueAndValidity();

      this.openCropperDialog = false;
    }
  }

  setTeamColor(color: any, customColor: boolean): void {
    if (customColor) {
      this.customColor = color;
    } else {
      this.customColor != '' ? (this.customColor = '') : '';
    }
    this.newTeamForm.patchValue({ color: color });
    this.isFileRejectedBySize = false;
    this.isFileRejectedByType = false;
  }

  prepareData() {
    this.getClubId();
    if (this.editingTeam !== null) {
      this.newTeamForm.patchValue({
        name: this.editingTeam.name,
        color: this.editingTeam.color,
        category: this.editingTeam.category,
        type_id: this.editingTeam.type_id,
        // modality_id: Number(this.editingTeam.modality_id),
        season_id: this.editingTeam.season_id,
        gender_id: this.editingTeam.gender_id,
        // image: this.editingTeam.image,
        // cover: this.editingTeam.cover,
        sport_id: this.editingTeam.sport_id,
        // club_id: ['', Validators.required],
      });
    }
  }

  getClubId(): void {
    this.appsStateQuery.club$.subscribe((res) => {
      const CLUBID = res.id;
      this.newTeamForm.patchValue({ club_id: CLUBID });
    });
  }

  ngOnInit(): void {
    this.generalService.getListSport(false, true).subscribe((data: any) => {
      this.sports = data.data;
    });

    this.generalService.getTeamGenders().subscribe((data: any) => {
      this.genders = data.data;
    });

    this.generalService.getSeasons().subscribe((data: any) => {
      this.seasons = data.data;
    });

    this.generalService.getTeamTypes().subscribe((data: any) => {
      this.teamTypes = data.data;
    });
  }
}
