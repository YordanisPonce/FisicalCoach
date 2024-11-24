import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../../_services/club.service';
import { SelectItem } from '../../../_models/selectItem';
import { GeneralService } from '../../../_services/general.service';
import { Club } from '../../../_models/club';
import { AppStateQuery } from '../../../stateManagement/appState.query';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  providers: [ConfirmationService],
})
export class MembersComponent implements OnInit {
  members: any[] = [];
  showModal = false;
  showDataAdvance = false;
  viewMember = false;
  loading = true;
  dataBasic: any;
  listJobArea: SelectItem[] = [];
  listGender: SelectItem[] = [];
  club: Club;
  typeFilter: string;
  filter = '';
  urlBase = environment.images;
  imagenPreview: any;
  openCropperDialog: boolean = false;
  role: string = '';

  translations: any = {};

  constructor(
    private clubService: ClubService,
    private appStateQuery: AppStateQuery,
    private generalService: GeneralService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;

    forkJoin(
      this.translate.get('LBL_CONFIRM_DELETE'),
      this.translate.get('LBL_CONFIRM_DIALOG'),
      this.translate.get('LBL_YES'),
      this.translate.get('LBL_NO')
    ).subscribe(([confirmDelete, confirmDialog, yes, no]) => {
      this.translations = {
        confirmDelete,
        confirmDialog,
        yes,
        no,
      };
    });

    this.loadList();
    this.appStateQuery.club$.subscribe((res: any) => {
      this.club = res;
      this.loadListMember();
    });
  }

  loadList() {
    this.showDataAdvance = false;
    this.showModal = false;
    this.clubService.getListJobAreas().subscribe((res) => {
      this.listJobArea = res.data;
    });
    this.appStateQuery.listGender$.subscribe((data) => {
      this.listGender = [];
      const genders = Object.assign([], data);
      genders.map((r: any) => {
        if (r.id !== 0) {
          this.listGender.push({ label: r.code, value: r.id });
        }
      });
    });
  }

  loadListMember() {
    this.showModal = false;
    this.showDataAdvance = false;
    this.members = [];
    this.loading = true;
    let filter = 'club_id=' + this.club.id;
    if (this.typeFilter) {
      filter += '&order=' + this.typeFilter;
    }
    this.clubService.getListMember(this.club.id, filter).subscribe(
      (r) => {
        this.members = r.data;
        this.loading = false;
      },
      (error) => {
        this.members = [];
        this.loading = false;
      }
    );
  }

  handleEdit(data: any) {
    this.viewMember = false;
    this.dataBasic = data;
    this.showDataAdvance = true;
  }

  handleView(data: any) {
    this.viewMember = true;
    this.dataBasic = data;
    this.showDataAdvance = true;
  }

  handleDelete(data: any) {
    this.clubService.deleteMember(this.club.id, data.id).subscribe((r) => {
      this.members = [];
      this.loadListMember();
    });
  }

  handleCreate() {
    this.viewMember = false;
    this.dataBasic = {};
    this.showDataAdvance = true;
    this.showModal = false;
  }

  handleQuickCreate() {
    this.dataBasic = {};
    this.showDataAdvance = false;
    this.showModal = true;
  }

  confirm(data: any) {
    this.confirmationService.confirm({
      header: this.translations.confirmDelete,
      message: this.translations.confirmDialog,
      acceptLabel: this.translations.yes,
      rejectLabel: this.translations.no,
      accept: () => {
        //Actual logic to perform a confirmation
        // this.classroomRubrics = []
        this.handleDelete(data);
      },
    });
  }
}
