import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/_services/club.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Invitation } from './_models/user-invitations.interface';
import HandleErrors from '../../../utils/errors';
import { AlertsApiService } from '../../../generals-services/alerts-api.service';

@Component({
  selector: 'app-members-invitations',
  templateUrl: './members-invitations.component.html',
  styleUrls: ['./members-invitations.component.scss'],
  providers: [ConfirmationService],
})
export class MembersInvitationsComponent implements OnInit {
  membersInvitations: Invitation[] = [];
  membersInvitationsList: Invitation[] = [];
  selectedPlayer: any = null;
  loading: boolean = false;
  inviteMemberDialog: boolean = false;
  invitationToEdit: any = null;
  errors: HandleErrors = new HandleErrors(this.msg);

  constructor(
    private clubService: ClubService,
    private translate: TranslateService,
    private appStateQuery: AppStateQuery,
    private msg: AlertsApiService,
    private confirmationService: ConfirmationService
  ) {}

  confirm(event: any, code: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('LBL_CONFIRM_DIALOG'),
      acceptLabel: this.translate.instant('LBL_YES'),
      rejectLabel: this.translate.instant('LBL_NO '),
      accept: () => {
        this.cancelMemberInvitation(code);
      },
    });
  }

  searchInvitation(event: any) {
    const search = event.target.value.toLowerCase();
    const filter: Invitation[] = this.membersInvitationsList.filter(
      (item: any) => item.invited_user_email?.toLowerCase().includes(search)
    );
    if (search.length > 0) {
      this.membersInvitations = filter;
    } else {
      this.membersInvitations = this.membersInvitationsList;
    }
  }

  getMembersInvitations() {
    this.loading = true;
    this.clubService
      .getMembersInvitationsList(this.getClubId())
      .subscribe((data: any) => {
        this.membersInvitationsList = this.membersInvitations = data.data;
        this.loading = false;
      });
  }

  editMemberInvitation(invitation: any) {
    this.getInvitationByCode(invitation.code);
  }

  cancelMemberInvitation(code: string) {
    this.clubService.cancelInvitation(code).subscribe({
      next: (data) => {
        this.refreshInvitations();
        this.msg.succes(data.message);
      },
      error: (error) => {
        this.errors.handleError(
          error,
          this.translate.instant('invite_members.errordelete')
        );
      },
    });
  }

  getClubId(): string {
    let clubId: string = '';
    this.appStateQuery.club$.subscribe((res) => {
      clubId = res.id;
    });
    return clubId;
  }

  refreshInvitations() {
    this.membersInvitationsList = [];
    this.getMembersInvitations();
  }

  ngOnInit(): void {
    this.getMembersInvitations();
  }

  private getInvitationByCode(code: string) {
    this.clubService
      .getInvitationByCode(this.getClubId(), code)
      .subscribe((res) => {
        this.invitationToEdit = res.data;
        this.inviteMemberDialog = true;
      });
  }
}
