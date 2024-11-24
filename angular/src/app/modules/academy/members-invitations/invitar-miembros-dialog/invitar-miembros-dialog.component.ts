import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ClubService } from 'src/app/_services/club.service';
import { UsersService } from 'src/app/_services/users.service';
import { TeamService } from 'src/app/_services/team.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import {
  InvitedUser,
  MembersInterface,
  Permission,
  UserPermissions,
} from '../_models/user-invitations.interface';

@Component({
  selector: 'invitar-miembros-dialog',
  templateUrl: './invitar-miembros-dialog.component.html',
  styleUrls: ['./invitar-miembros-dialog.component.scss'],
})
export class InvitarMiembrosDialogComponent implements OnInit {
  step: number = 1;
  @Input() visible: boolean = false;
  @Input() invitations: InvitedUser[] = [];
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() invitationSent: EventEmitter<boolean> = new EventEmitter<boolean>();
  loading: boolean = false;
  clubMembers: MembersInterface[] = [];
  clubMembersList: MembersInterface[] = [];
  clubTeams: any = [];
  editTeams: any = [];
  usersPermissions: UserPermissions[] = [];
  emailInvitations: { email: string; image: any; selected: boolean }[] = [];
  annotation: string;
  selectedTeam: any = null;
  selectedInvitation: any | null = null;
  currentPermissions: string[] = [];
  allPermissions: any = {};
  allModulePermissions: boolean = false;
  submittedForm: boolean = false;
  invitedUser: InvitedUser = {} as InvitedUser;
  value: any;
  inviteMembersForm: UntypedFormGroup = this.formBuilder.group({
    club_id: [this.getClubId(), Validators.required],
    annotation: [null],
    invited_users: ['', Validators.required],
  });
  optionsOnlyUpdate: string[] = ['club', 'team'];
  teamListPermission: string | undefined;
  clubListPermission: string | undefined;
  isEditing: boolean = false;

  constructor(
    private clubService: ClubService,
    private usersService: UsersService,
    private formBuilder: UntypedFormBuilder,
    private teamService: TeamService,
    private appStateQuery: AppStateQuery,
    public alerts: AlertsApiService,
    private translate: TranslateService
  ) {}

  _editInvitation: any = null;

  @Input() set editInvitation(value: any) {
    this._editInvitation = value;

    this.loadEditData();
  }

  selectMember(member: any) {
    if (member.selected) {
      this.emailInvitations.filter((item) => item.email !== member.email);
    } else {
      this.emailInvitations.push({
        email: member.email,
        image: member.image,
        selected: true,
      });
    }
    member.selected = !member.selected;
  }

  searchMember(event: any) {
    const search = event.target.value.toLowerCase();
    const filter = this.clubMembers.filter((item: any) =>
      item.full_name?.toLowerCase().includes(search)
    );
    if (search.length > 0) {
      this.clubMembers = filter;
    } else {
      this.clubMembers = this.clubMembersList;
    }
  }

  removeInvitation(value: any) {
    this.emailInvitations = this.emailInvitations.filter(
      (item) => item.email !== value
    );

    const memberInvitationIndex: number = this.clubMembers.findIndex(
      (el: MembersInterface) => el.email === value
    );
    if (memberInvitationIndex > -1) {
      this.clubMembers[memberInvitationIndex].selected = false;
    }
  }

  addGuest(ev: any, validation: boolean | null) {
    if (ev.key === 'Enter' || ev.type === 'blur') {
      if (ev.target.value === '') {
        return;
      }
      if (
        ev.target.value.length > 0 &&
        !this.emailInvitations.includes(ev.target.value) &&
        validation
      ) {
        this.emailInvitations.push({
          email: ev.target.value,
          image: null,
          selected: true,
        });
        ev.target.value = '';
      }
    }
  }

  // this is used for thw mobile Dropdown of email invitations
  mobileEmailInvitations() {
    return this.emailInvitations.map((el: any) => {
      return {
        email: el,
      };
    });
  }

  selectInvitationTeam(ev: any) {
    this.loadInvitationPermissions(
      this.selectedInvitation?.email!,
      ev.value.id
    );
  }

  selectInvitationEmail(value: any) {
    this.selectedInvitation = value;
    this.invitedUser.email = value.email;
    this.loadInvitationPermissions(value.email, this.selectedTeam?.id);
  }

  getLabelPermissionName(val: string): string {
    if (val.includes('list')) {
      return this.translate.instant('invite_members.list');
    }
    if (val.includes('read')) {
      return this.translate.instant('invite_members.read');
    }
    if (val.includes('store')) {
      return this.translate.instant('invite_members.create');
    }
    if (val.includes('update')) {
      return this.translate.instant('invite_members.edit');
    }
    if (val.includes('delete')) {
      return this.translate.instant('invite_members.delete');
    }
    return '';
  }

  setInvitationPermissions(
    moduleType: string | null,
    permissions: Permission[] | null,
    permission?: string
  ) {
    if (
      permission?.includes('update') ||
      permission?.includes('store') ||
      permission?.includes('delete')
    ) {
      const permissionToAdd: string | undefined = permissions?.find((el: any) =>
        el.name.includes('list')
      )?.name;
      if (
        permissionToAdd &&
        !this.currentPermissions.includes(permissionToAdd)
      ) {
        this.currentPermissions.push(permissionToAdd);
      }
      if (moduleType === 'team') {
        this.currentPermissions.push(this.teamListPermission as string);
      }
      if (moduleType === 'club') {
        this.currentPermissions.push(this.clubListPermission as string);
      }
    }
    if (permissions !== null) {
      const permissionsArray: string[] = permissions.map((el: any) => el.name);
      const permissionsNotSelected: string[] = permissionsArray.filter(
        (permission: string) => !this.currentPermissions.includes(permission)
      );
      this.setCheckBoxAll(permissionsNotSelected, moduleType);
    }
    const invitationIndex: number = this.invitations.findIndex(
      (el: any) => el.email === this.invitedUser.email
    );
    const invitationExist: InvitedUser | undefined =
      this.invitations[invitationIndex];
    this.allModulePermissions = this.validateAllPermissionsSelected();
    if (invitationExist) {
      let teamPermissionsExist: boolean;
      const teamIndex: number =
        invitationExist?.teams.findIndex(
          (el: any) => el.id === this.selectedTeam.id
        ) || 0;
      teamPermissionsExist = teamIndex > -1;
      if (teamPermissionsExist) {
        this.invitations[invitationIndex].teams[teamIndex].permissions =
          this.currentPermissions;
      } else {
        this.invitations.map((el: any) => {
          if (el.email === this.invitedUser.email) {
            return el.teams.push({
              id: this.selectedTeam.id,
              permissions: this.currentPermissions,
            });
          }
        });
      }
    } else {
      this.invitedUser.teams = [
        {
          id: this.selectedTeam.id,
          permissions: this.currentPermissions,
        },
      ];
      this.invitations.push({ ...this.invitedUser });
    }
    this.inviteMembersForm.patchValue({ invited_users: this.invitations });
  }

  setAllModulesPermissions(ev: any) {
    this.currentPermissions = [];
    this.usersPermissions.forEach((element: any) => {
      this.setAllPermissions(ev, element.permissions);
      this.allPermissions[element.type] = ev.checked;
    });
  }

  setAllPermissions(ev: any, permissions: any) {
    let permissionsArray = permissions.map((el: any) => el.name);
    if (ev.checked) {
      this.currentPermissions = [
        ...this.currentPermissions,
        ...permissionsArray,
      ];
    } else {
      this.currentPermissions = this.currentPermissions.filter(
        (permission: string) => !permissionsArray.includes(permission)
      );
    }
    this.setInvitationPermissions(null, null);
  }

  prepareInvitations() {
    if (this.emailInvitations.length !== 0) {
      this.step = 3;
    }
  }

  invitationProcessFinished() {
    this.invitationSent.emit(true);
    this.clearInvitations();
    this.step = 4;
    this.loading = this.submittedForm = false;
  }

  onSubmit() {
    if (this.inviteMembersForm.invalid) {
      return;
    } else {
      this.loading = true;
      if (this._editInvitation) {
        this.isEditing = true;
        this.clubService
          .updateMembersInvitation(this.formatDataToEdit())
          .subscribe(
            (res: any) => {
              this.invitationProcessFinished();
            },
            ({ error }) => {
              this.loading = false;
              this.alerts.error(error);
            }
          );
      } else {
        this.inviteMembersForm.patchValue({ annotation: this.annotation });
        this.clubService.inviteMembers(this.inviteMembersForm.value).subscribe(
          (res: any) => {
            this.invitationProcessFinished();
          },
          ({ error }) => {
            this.loading = false;
            this.alerts.error(error);
          }
        );
      }
    }
  }

  closeDialog() {
    this.isEditing = false;
    this.close.emit(false);
    if (this.clubMembers.length === 0) {
      this.step = 2;
    } else {
      this.step = 1;
    }
    this.clearInvitations();
    this.unselectAllMembers();
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit(): void {
    this.getClubMembers();
    this.getPermissions();
    this.getClubTeams(this.getClubId());
  }

  private formatDataToEdit() {
    return {
      club_id: this.getClubId(),
      annotation: this._editInvitation.annotation,
      invited_users: [
        {
          email: this._editInvitation.invited_user_email,
          teams: [this._editInvitation.team_id],
          permissions_list: [...this.currentPermissions],
        },
      ],
    };
  }

  private loadEditData() {
    if (this._editInvitation?.id) {
      this.emailInvitations = [this._editInvitation.invited_user_email];

      this.selectedInvitation = this._editInvitation.invited_user_email;
      this.inviteMembersForm.patchValue({
        invited_users: this.selectedInvitation,
      });
      this.editTeams = [
        this.clubTeams.find((x: any) => x.id === this._editInvitation.team_id),
      ];
      this.selectedTeam = this.editTeams[0];
      this.currentPermissions = this._editInvitation.permissions.map(
        (x: any) => x.name
      );
      this.loadInvitationPermissions(
        this._editInvitation.invited_user_email,
        this._editInvitation.team_id
      );
      this.step = 3;
    }
  }

  private validateAllPermissionsSelected() {
    let allModulePermissions: string[] = [];
    this.usersPermissions.forEach((modulePermissions: UserPermissions) => {
      let permissionsArray: string[] = modulePermissions.permissions.map(
        (el: any) => el.name
      );
      allModulePermissions = [...allModulePermissions, ...permissionsArray];
    });
    const comparePermissions: string[] = allModulePermissions.filter(
      (permission: string) => !this.currentPermissions.includes(permission)
    );
    return comparePermissions.length === 0;
  }

  private loadInvitationPermissions(email: string, team: number) {
    let invitation: InvitedUser | undefined;
    if (this._editInvitation) {
      invitation = this._editInvitation;
    } else {
      invitation = this.invitations.find((el: any) => el.email === email);
    }
    if (invitation !== undefined) {
      let invitationPermissions: any;
      if (this._editInvitation) {
        invitationPermissions = {
          permissions: this._editInvitation.permissions.map((x: any) => x.name),
        };
      } else {
        invitationPermissions = invitation.teams.find(
          (el: any) => el.id === team
        );
      }
      if (invitationPermissions !== undefined) {
        this.usersPermissions.forEach((element: any) => {
          const permissionsArray = element.permissions.map(
            (el: any) => el.name
          );
          let allPermissions: boolean = true;
          permissionsArray.forEach((el: any) => {
            if (!invitationPermissions.permissions.includes(el)) {
              allPermissions = false;
            }
          });
          this.allPermissions[element.type] = allPermissions;
        });
        this.currentPermissions = invitationPermissions.permissions;
        if (this.validateAllPermissionsSelected()) {
          this.allModulePermissions = true;
        }
      } else {
        this.currentPermissions = [];
        this.allModulePermissions = false;
        this.allPermissions = {};
      }
    } else {
      this.currentPermissions = [];
      this.allModulePermissions = false;
      this.allPermissions = {};
    }
  }

  private getClubMembers() {
    this.clubService
      .getInvitationsMembers(this.getClubId())
      .subscribe((data: any) => {
        this.loading = false;
        this.clubMembers = this.clubMembersList = data.data;

        if (this.clubMembers.length === 0) {
          this.step = 2;
        }
      });
  }

  private unselectAllMembers() {
    this.clubMembers.map((member: any) => {
      member.selected = false;
      return member;
    });
  }

  private getClubTeams(idClub: any) {
    this.teamService.getList(idClub).subscribe((res) => {
      this.clubTeams = res.data;
    });
  }

  private getPermissions() {
    this.usersService.getUsersPermissions().subscribe((data: any) => {
      const list: UserPermissions[] = data.data;
      this.usersPermissions = list.map((x: UserPermissions) => {
        if (this.optionsOnlyUpdate.includes(x.type)) {
          if (x.type === 'team') {
            this.teamListPermission = x.permissions.find((x: Permission) =>
              x.name.includes('list')
            )?.name;
          }
          if (x.type === 'club') {
            this.clubListPermission = x.permissions.find((x: Permission) =>
              x.name.includes('list')
            )?.name;
          }
          const item: UserPermissions = {
            index: x.index,
            type: x.type,
            permissions: x.permissions.filter((x: Permission) =>
              x.name.includes('update')
            ),
          };
          return item;
        } else {
          return x;
        }
      });
    });
  }

  private clearInvitations() {
    this.inviteMembersForm.patchValue({ invited_users: '' });
    this.invitations = [];
    this.emailInvitations = [];
    this.currentPermissions = [];
    this.allPermissions = {};
    this.selectedInvitation = null;
    this.selectedTeam = null;
    this._editInvitation = null;
    this.allModulePermissions = false;
    this.editTeams = null;
    this.clubMembers = this.clubMembersList;
    this.invitedUser = {
      email: '',
      teams: [],
      permissions_list: [],
    };
  }

  private getClubId(): string {
    let clubId: string = '';
    this.appStateQuery.club$.subscribe((res) => {
      clubId = res.id;
    });
    return clubId;
  }

  private setCheckBoxAll(
    permissionsNotSelected: any[],
    moduleType: string | null
  ) {
    permissionsNotSelected.length === 0
      ? (this.allPermissions[moduleType!] = true)
      : (this.allPermissions[moduleType!] = false);
  }
}
