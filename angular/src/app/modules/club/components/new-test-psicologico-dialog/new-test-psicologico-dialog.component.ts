import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { PsychologyReport } from 'src/app/_models/psychology';
import { TeamService } from 'src/app/_services/team.service';
import { SelectItem } from '../../../../_models/selectItem';
import { PsychologyService } from '../../../../_services/psychology.service';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-new-test-psicologico-dialog',
  templateUrl: './new-test-psicologico-dialog.component.html',
  styleUrls: ['./new-test-psicologico-dialog.component.scss'],
})
export class NewTestPsicologicoDialogComponent implements OnInit {
  formNewTestPsychology: UntypedFormGroup;
  step: number = 1;
  @Input() visible: boolean = false;
  @Input() isPlayerReport: boolean = false;
  @Input() playerReportData: PsychologyReport;
  @Input() listPlayers: any[] = [];
  @Input() playerId: number = 0;
  @Input() staffs: any[] = [];
  @Input() team: ITeam;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshReports = new EventEmitter<boolean>();
  @Output() reload = new EventEmitter<boolean>();
  listPlayersOptions: SelectItem[] = [];
  listStaffs: SelectItem[] = [];
  cities: City[];
  selectedCity!: any;
  selectedValue: any;
  maxDate = new Date();
  yearRange = '';
  submitted: boolean = false;
  saving: boolean = false;
  inputEvaluator: boolean = false;
  filters: any[];
  listSpecialists: any[] = [];
  selectedSpecialist: any = {
    1: false,
    2: false,
    3: false,
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private psychologyService: PsychologyService,
    private msg: AlertsApiService,
    private appStateService: AppStateService,
    private teamService: TeamService
  ) {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }
  get f() {
    return this.formNewTestPsychology.controls;
  }
  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
  }

  ngOnInit(): void {
    this.yearRange = '1990:' + new Date().getFullYear();
    this.listPlayersOptions = [];
    this.listStaffs = [];
    this.listPlayers.map((r: any) => {
      this.listPlayersOptions.push({
        label: r.full_name,
        value: r.id,
        image: r.image,
        gender: r.gender,
      });
    });

    this.getStaff();
    this.getList();
    this.loadForm();
  }

  /**
   * staff list by team
   */
  getStaff() {
    this.teamService
      .getStaffByTeam(this.team.id as unknown as string)
      .subscribe((res) => {
        this.staffs = res.data;

        const staffs = this.staffs.map((x) => ({
          cname: x.full_name,
          code: x.id,
        }));

        this.staffs.map((r: any) => {
          this.listStaffs.push({ label: r.full_name, value: r.id });
        });

        this.filters = [
          {
            name: 'Staffs',
            code: 'ST',
            staffs,
          },
        ];

        this.loadForm();

        this.formNewTestPsychology
          .get('staff_id')
          ?.setValue(this.listStaffs[0].value);
      });
  }

  /**
   * list specialist
   */
  getList() {
    this.psychologyService.getListSpecialists().subscribe((r) => {
      this.listSpecialists = r.data;
    });
  }

  loadForm() {
    if (this.playerReportData?.staff_name) this.inputEvaluator = true;

    this.formNewTestPsychology = this.formBuilder.group({
      psychology_specialist_id: [
        this.playerReportData?.psychology_specialist_id || null,
      ],
      staff_id: [
        this.playerReportData?.staff_id,
        !this.playerReportData?.staff_name ? Validators.required : null,
      ],
      date: [
        new Date(moment(this.playerReportData?.date).format('MM-DD-YYYY')) ||
          null,
        Validators.required,
      ],
      anamnesis: [this.playerReportData?.anamnesis || null],
      staff_name: [this.playerReportData?.staff_name || null],
      note: [this.playerReportData?.note || null],
      cause: [this.playerReportData?.cause || null],
      presumptive_diagnosis: [
        this.playerReportData?.presumptive_diagnosis || null,
      ],
    });
  }
  onSubmit() {}

  next() {
    this.submitted = true;

    if (this.step === 1) {
      this.formNewTestPsychology.controls.cause.clearValidators();
      this.formNewTestPsychology.controls.presumptive_diagnosis.clearValidators();

      this.formNewTestPsychology.get('cause')?.updateValueAndValidity();
      this.formNewTestPsychology
        .get('presumptive_diagnosis')
        ?.updateValueAndValidity();
    }

    if (this.formNewTestPsychology.invalid) {
      return;
    }
    this.submitted = false;
    if (this.step < 5) {
      this.step++;
      if (this.step === 2) {
        this.formNewTestPsychology.controls.cause.setValidators(
          Validators.required
        );
      } else if (this.step === 4) {
        this.formNewTestPsychology.controls.presumptive_diagnosis.setValidators(
          Validators.required
        );
      }
      return;
    }
    const data = this.formNewTestPsychology.getRawValue();

    if (data.staff_name) delete data.staff_id;
    if (data.staff_id) delete data.staff_name;
    if (!data.psychology_specialist_id) delete data.psychology_specialist_id;

    data.team_id = this.team.id;

    this.saving = true;

    if (!this.playerReportData) {
      this.psychologyService
        .add({ ...data, player_id: this.playerId })
        .subscribe(
          (r) => {
            this.msg.succes(r.message);

            this.close.emit(true);
            this.reload.emit(true);
            this.saving = false;
          },
          ({ error }) => {
            this.msg.error(error);
            this.saving = false;
          }
        );
    } else {
      this.psychologyService.update(data, this.playerReportData.id).subscribe(
        (r) => {
          this.msg.succes(r.message);

          this.close.emit(true);
          this.refreshReports.emit(true);
          this.appStateService.updatePlayerPsychology$({
            isReport: true,
            data: r.data,
          });
          this.saving = false;
        },
        ({ error }) => {
          this.msg.error(error);
          this.saving = false;
        }
      );
    }
  }
  handleBack() {
    if (this.step === 1) {
      this.close.emit(false);
      return;
    }
    this.step--;
  }
  handleEvaluator() {
    this.inputEvaluator = !this.inputEvaluator;

    if (this.inputEvaluator) {
      this.formNewTestPsychology.controls.staff_name.setValidators(
        Validators.required
      );
      this.formNewTestPsychology.controls.staff_name.updateValueAndValidity();
      this.formNewTestPsychology.controls.staff_id.setValidators(null);
      this.formNewTestPsychology.controls.staff_id.updateValueAndValidity();
    } else {
      this.formNewTestPsychology.controls.staff_id.setValidators(
        Validators.required
      );
      this.formNewTestPsychology.controls.staff_id.updateValueAndValidity();
      this.formNewTestPsychology.controls.staff_name.setValidators(null);
      this.formNewTestPsychology.controls.staff_name.updateValueAndValidity();
    }
  }

  handleSpecialist(e: any): any {
    const value = this.formNewTestPsychology.get(
      'psychology_specialist_id'
    )?.value;

    if (!e) return;

    if (!this.selectedSpecialist[value]) {
      Object.entries(this.selectedSpecialist).forEach((item) => {
        this.selectedSpecialist[item[0]] = false;
      });
      this.selectedSpecialist[value] = true;
    } else {
      this.selectedSpecialist[value] = false;
      this.formNewTestPsychology
        .get('psychology_specialist_id')
        ?.setValue(null);
    }
  }

  showstaffid() {
    return (
      !this.inputEvaluator &&
      (this.playerReportData?.staff_name ||
        this.playerReportData?.team_staff_name) &&
      this.isPlayerReport
    );
  }

  staff_name() {
    return (
      this.inputEvaluator &&
      (this.playerReportData?.staff_name ||
        this.playerReportData?.team_staff_name) &&
      this.isPlayerReport
    );
  }
}
