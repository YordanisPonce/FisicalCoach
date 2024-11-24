import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SelectItem } from '../../../_models/selectItem';
import { GeneralService } from '../../../_services/general.service';
import { ClubService } from '../../../_services/club.service';
import { Club } from '../../../_models/club';
import { Router } from '@angular/router';
import { AppStateService } from '../../../stateManagement/appState.service';
import { ComunicationComponentService } from '../../../_services/comunicationComponent.service';
import { AppStateQuery } from '../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { environment } from 'src/environments/environment';
import HandleErrors from '../../../utils/errors';

@Component({
  selector: 'app-add-club',
  templateUrl: './add-club.component.html',
  styleUrls: ['./add-club.component.scss'],
})
export class AddClubComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  addSpaceDialog: boolean = false;
  step: number = 0;
  formClub: UntypedFormGroup;
  submitted!: boolean;
  loadingSubmit: boolean = false;
  listCountries: SelectItem[] = [];
  listAllCountries: any[] = [];
  listProvincies: SelectItem[] = [];
  imagen: any;
  imagenPreview: any;
  @Input() club: Club;
  subs: Subscription;
  imageEdit: boolean = false;
  countrySelected: any;
  urlBase = environment.images;
  language = localStorage.getItem('lang');
  errors: HandleErrors = new HandleErrors(this.msg);
  openCropperDialog: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private clubService: ClubService,
    private appStateService: AppStateService,
    private appStateQuery: AppStateQuery,
    private router: Router,
    private comunicationComponentService: ComunicationComponentService,
    private generalService: GeneralService,
    private translateService: TranslateService,
    private msg: AlertsApiService
  ) {}

  get f() {
    return this.formClub.controls;
  }

  ngOnInit(): void {
    this.loadForm(this.club);
    this.loadList();
  }

  getScreenWidth(): any {
    return screen.width;
  }

  loadList() {
    this.listAllCountries = this.appStateService.getCountries();

    const listCountries = Object.assign([], this.listAllCountries);
    const list: any = [];
    listCountries.map((r: any) => {
      list.push({ label: r.emoji + ' ' + r.name, value: r.id });
    });
    this.listCountries = list;

    if (this.club && this.club.id) {
      this.formClub.controls.country_id.setValue(this.club.address.country.id);
      this.getProvince(this.club.address.country.id);
    }
  }

  getProvince(event: any) {
    this.countrySelected = this.listAllCountries.find((x) => x.id === event);
    const code = this.countrySelected.iso2;
    this.generalService.getProvincies(code).subscribe((res) => {
      const list: any = [];
      res.data.map((r: any) => {
        list.push({ label: r.name, value: r.id });
      });
      this.listProvincies = list;
      if (this.club && this.club.id) {
        this.formClub.controls.province_id.setValue(
          this.club.address.province?.id
        );
      }
    });
  }

  loadForm(club?: any): void {
    this.formClub = this.formBuilder.group({
      id: [club ? club.id : null],
      name: [club ? club.name : '', Validators.required],
      street: [club?.address ? club?.address?.street : ''],
      postal_code: [club?.address ? club?.address.postal_code : ''],
      city: [club?.address ? club?.address.city : ''],
      province_id: [club?.address ? club.province?.id : null],
      phone: [this.getPhoneArray(club)],
      mobile_phone: [this.getMobilePhoneArray(club)],
      country_id: [club ? club.country_id : null, Validators.required],
      sportType: [null],
    });
  }

  getPhoneArray(club: any) {
    if (club?.address) {
      return club.address.phone.filter((x: any) => x !== '');
    } else {
      return [];
    }
  }
  getMobilePhoneArray(club: any) {
    if (club?.address) {
      return club.address.mobile_phone.filter((x: any) => x !== '');
    } else {
      return [];
    }
  }

  validateForm(): void {
    this.submitted = true;
    this.loadingSubmit = true;
    if (this.formClub.invalid) {
      this.loadingSubmit = false;
      return;
    }
    const club = this.formClub.value as any;
    if (this.club && this.club.id) {
      this.clubService
        .update(club, this.imagen)
        .then((res: any) => {
          const response = JSON.parse(res);

          this.club.name = club.name;
          this.club.address.country_id = club.country_id;
          this.club.address.province_id = club.province_id;
          this.club.address.phone = club.phone;
          this.club.address.mobile_phone = club.mobile_phone;
          this.club.address.postal_code = club.postal_code;
          this.club.address.city = club.city;
          this.club.address.street = club.street;
          if (this.imageEdit) {
            this.club.image = this.imagenPreview || null;
          }
          this.closeAndRedirect(this.club, false, response);
        })
        .catch((err) => {
          this.errors.handleError(
            err,
            this.translateService.instant('CLUB.updateerror')
          );
          this.closeModal();
          this.router.navigate(['/inicio']);
          this.loadingSubmit = false;
        });
    } else {
      this.clubService
        .add(club, this.imagen)
        .then((res: any) => {
          this.loadingSubmit = false;
          const response = JSON.parse(res);

          const clubSave = response.data as Club;
          clubSave.image = this.imagenPreview || null;
          clubSave.address = {} as any;
          clubSave.address.mobile_phone = club.mobile_phone;
          clubSave.address.phone = club.phone;
          clubSave.address.postal_code = club.postal_code;
          clubSave.address.country_id = club.country_id;
          clubSave.address.province_id = club.province_id;
          clubSave.address.city = club.city;
          this.closeAndRedirect(clubSave, true, response);
        })
        .catch((err) => {
          this.loadingSubmit = false;
          this.errors.handleError(
            err,
            this.translateService.instant('CLUB.saveerror')
          );
          this.closeModal();
          this.router.navigate(['/inicio']);
          this.comunicationComponentService.recargarMenuListaClubs(true);
        });
    }
  }

  closeAndRedirect(club: any, edit: boolean, response: any) {
    this.loadingSubmit = false;
    this.closeModal();
    this.appStateService.updateClub(club);
    this.comunicationComponentService.recargarMenuListaClubs(true);
    this.router.navigate(['academy/home/' + club.id]);
    this.msg.succes(response.message);
  }

  closeModal() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
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
      this.imagenPreview = { full_url: reader.result, id: null };
      this.imagen = file;
      this.imageEdit = true;
      this.openCropperDialog = false;
    };
  }

  tooltip(): string {
    if (this.step === 2 && this.club && this.club.id && !this.loadingSubmit) {
      return 'academySidebar.update_club';
    } else if (
      this.step === 2 &&
      (!this.club || !this.club.id) &&
      !this.loadingSubmit
    ) {
      return 'academySidebar.create_club';
    } else if (this.step !== 2 && !this.loadingSubmit) {
      return 'LBL_SIGUIENTE';
    } else if (this.loadingSubmit) {
      return 'LBL_GUARDANDO';
    } else {
      return '';
    }
  }
}
