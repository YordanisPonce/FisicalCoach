import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { SelectItem } from '../../../../_models/selectItem';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { Player } from 'src/app/_models/player';
import { GeneralService } from 'src/app/_services/general.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-new-player',
	templateUrl: './new-player.component.html',
	styleUrls: ['./new-player.component.scss'],
})
export class NewPlayerComponent implements OnInit, OnDestroy {
	formNewPlayer: UntypedFormGroup;
	list: SelectItem[] = [];
	submitted: boolean = false;
	@Input() listPositionsAll: any[] = [];
	listGenders: any[] = [];
	@Input() listGenderIdentity: any[] = [];
	@Input() playerData: any;
	@Output()
	nextstep: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	goBack: EventEmitter<void> = new EventEmitter<void>();
	listPositions: SelectItem[] = [];
	sportName: string;
	team: ITeam;
	role: 'sport' | 'teacher';
	validation: any = new FieldsValidation();
	subs = new Subscription()

	constructor(
		private formBuilder: UntypedFormBuilder,
		private appStateService: AppStateService,
		private generalService: GeneralService
	) {}

	get f() {
		return this.formNewPlayer.controls;
	}

	ngOnInit(): void {
		this.team = this.appStateService.getTeam();
		this.role = localStorage.getItem('role') as 'sport' | 'teacher';
		this.sportName = this.team?.slug;
		this.listPositionsAll.map((r: any) => {
			this.listPositions.push({ label: r.name, value: r.id });
		});

			this.getGenderList()
		this.loadForm();
	}

	getGenderList(): void {
		this.subs = this.generalService.getListGender().subscribe(res => {
			this.listGenders = res.data
		})
	}

	loadForm() {
		const gender = this.team.gender_id;

		if (this.role === 'teacher') {
			this.formNewPlayer = this.formBuilder.group({
				classroom_academic_year_id: [
					this.appStateService.getClassroomAcademicYear(),
					Validators.required,
				],
				full_name: [this.playerData?.full_name || null, Validators.required],
				gender_id: [this.playerData?.gender_id || null, Validators.required],
				list_number: [
					this.playerData?.list_number || null,
					Validators.required,
				],
			});
		} else {
			this.formNewPlayer = this.formBuilder.group({
				full_name: [this.playerData?.full_name || null, Validators.required],
				alias: [this.playerData?.alias || null, Validators.required],
				gender_id: [gender, Validators.required],
				position_id: [
					this.playerData?.position_id || null,
					this.listPositions.length > 0 ? Validators.required : [],
				],
				shirt_number: [
					this.playerData?.shirt_number || null,
					Validators.required,
				],
			});
		}

		if (gender === 1 || gender === 2)
			this.formNewPlayer.get('gender_id')?.disable();
	}

	getScreenWidth(): any {
		return screen.width;
	}

	onSubmit() {
		this.submitted = true;
		let fields;
		if (this.role === 'teacher') {
			fields = ['full_name', 'gender_id', 'list_number'];
		} else {
			fields = ['full_name', 'alias', 'position_id', 'shirt_number'];
		}
		this.validation.validateStepFields(fields, this.formNewPlayer);
		if (this.formNewPlayer.invalid) {
			return;
		}
		const data = this.formNewPlayer.value;

		this.nextstep.emit(data);
	}

		ngOnDestroy(): void {
			if (this.subs) this.subs.unsubscribe()
		}
}
