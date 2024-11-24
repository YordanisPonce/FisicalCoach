import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SelectItem } from '../../../../_models/selectItem';
import { ClubService } from '../../../../_services/club.service';
import { TeamService } from 'src/app/_services/team.service';
import { Club } from '../../../../_models/club';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.scss'],
})
export class NewMemberComponent implements OnInit, OnDestroy {
  validation = new FieldsValidation();
  formMember: UntypedFormGroup;
  submitted = false;
  showImagen = false;
  saving = false;
  imagen: any;
  imagenPreview: any = '';
  club: Club;
  team: any;
  subs: Subscription;
  responsabilityItems: any = null;
  selectedResponsability: any = null;
  openCropperDialog: boolean = false;
  @Input() listJobArea: SelectItem[] = [];
  @Input() listGender: SelectItem[] = [];
  @Input() member: 'team' | 'club' = 'club';
  @Output() data = new EventEmitter<any>();
  @Output() goBack = new EventEmitter<any>();
  @Output() save = new EventEmitter<boolean>();

  constructor(
    private sanitizer: DomSanitizer,
    private formBuilder: UntypedFormBuilder,
    private clubService: ClubService,
    private appStateQuery: AppStateQuery,
    private teamService: TeamService,
    public alerts: AlertsApiService
  ) {}

  get f() {
    return this.formMember.controls;
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (this.member === 'team') {
      this.subs = this.appStateQuery.team$.subscribe((res) => {
        this.team = res;
      });
    } else {
      this.subs = this.appStateQuery.club$.subscribe((res) => {
        this.club = res;
      });
    }
    this.loadForm();
  }

  getScreenWidth(): any {
    return screen.width;
  }

  loadForm(): void {
    this.formMember = this.formBuilder.group({
      full_name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      jobs_area_id: [null, Validators.required],
      position_staff_id: [null, Validators.required],
      responsibility: [null],
      gender_id: [null, Validators.required],
    });
  }

  setResponsabilityItems() {
    const area: any = this.listJobArea.find(
      (area: any) => area.id == this.f.jobs_area_id.value
    );
    this.responsabilityItems = area.positions;
  }

  setResponsabilityValue() {
    this.formMember.patchValue({
      position_staff_id: this.selectedResponsability.id,
    });
  }

  onSubmit() {
    this.submitted = true;
    if (
      !this.validation.validateStepFields(
        [
          'full_name',
          'email',
          'jobs_area_id',
          'position_staff_id',
          'gender_id',
        ],
        this.formMember
      )
    ) {
      if (this.formMember.invalid) {
        return;
      }
      this.showImagen = true;
    }
  }

  back() {
    this.formMember.reset();
    this.submitted = false;
    this.goBack.emit();
  }

  async fileUpload(event: any, tipo: string) {
    const file = event.target.files[0];
    this.imagen = file;
    this.preview(file);
  }

  preview(file: File) {
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.imagenPreview = { url: reader.result, id: null };
    };
  }

  sendDatos() {
    const data = this.formMember.value;
    data.image = this.imagen;
    this.data.emit(data);
  }

  savedMember() {
    this.saving = false;
    this.save.emit(true);
    this.formMember.reset();
    this.back();
  }

  saveclubMember() {
    const data = this.formMember.value;
    if (this.imagen) data.image = this.imagen;
    this.clubService
      .addMember(data, this.club)
      .then((r) => {
        this.savedMember();
      })
      .catch(({ error }) => {
        this.saving = false;
        this.alerts.error(error);
      });
  }

  saveTeamMember() {
    const data = this.formMember.value;
    if (this.imagen) data.image = this.imagen;
    this.teamService
      .addMember(data, this.team)
      .then((r) => {
        this.savedMember();
      })
      .catch(({ error }) => {
        this.saving = false;
        this.alerts.error(error);
      });
  }

  getImage(file: File): void {
    this.readURL(file);
  }

  /**
   * read competition and rival image urls
   * @param event
   * @param type
   */
  readURL(file: File): void {
    if (file) {
      const reader = new FileReader();
      this.imagenPreview = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
      reader.readAsDataURL(file);

      this.imagen = file;

      this.openCropperDialog = false;
    }
  }

  saveInfo() {
    this.saving = true;
    const data = this.formMember.value;

    if (this.member === 'team') {
      this.saveTeamMember();
    } else {
      this.saveclubMember();
    }
  }
}
