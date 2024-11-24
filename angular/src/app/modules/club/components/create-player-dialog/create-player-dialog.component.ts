import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
} from '@angular/core';
import { SelectItem } from '../../../../_models/selectItem';
import { PlayersService } from '../../../../_services/players.service';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { NewPlayerComponent } from '../new-player/new-player.component';
import { PlayerPersonalDataComponent } from '../players/player-personal-data/player-personal-data.component';
import { PlayerContactDataComponent } from '../players/player-contact-data/player-contact-data.component';
import { PlayerSportingDataComponent } from '../players/player-sporting-data/player-sporting-data.component';
import { PlayerFamilyDataComponent } from '../players/player-family-data/player-family-data.component';
import { NewAgentComponent } from '../new-agent/new-agent.component';
import { AlumnsService } from 'src/app/_services/alumns.service';
import { AlumnAcademicDataComponent } from 'src/app/modules/teacher/components/alumn-academic-data/alumn-academic-data.component';
import { AlumnSportingDataComponent } from 'src/app/modules/teacher/components/alumn-sporting-data/alumn-sporting-data.component';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { TranslateService } from '@ngx-translate/core';
import HandleErrors from '../../../../utils/errors';
import { ITeam } from 'src/app/_models/ITeam.interface';

@Component({
	selector: 'app-create-player-dialog',
	templateUrl: './create-player-dialog.component.html',
	styleUrls: ['./create-player-dialog.component.scss'],
})
export class CreatePlayerDialogComponent implements OnInit {
	@Input() visible: boolean = false;
	@Input() listCountriesAll: any[] = [];
	@Input() listKinships: any[] = [];
	@Input() listLaterality: any[] = [];
	@Input() listPositions: any[] = [];
	@Input() listGenders: any[] = [];
	@Input() listAcneaeTypes: any[] = [];
	@Input() listGenderIdentity: any[] = [];
	@Input() listSports: any[] = [];
	@Input() listCourses: any[] = [];

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	steps: any[];
	step: number = 1;
	selectedValue: any;
	advancedDialog: boolean = false;
	selectStep = 1;
	fecha!: any;
	formData = {} as any;
	data: any = {};
	selectedCity!: any;
	player: any = {};
	listCountries: SelectItem[] = [];
	saving = false;
	team: ITeam;
	subs: Subscription;
	imagen: any;
	imagenPreview: any;
	role: 'sport' | 'teacher';
	error: HandleErrors = new HandleErrors(this.msg);
	openCropperDialog: boolean = false;

	@ViewChild(NewPlayerComponent) newPlayer: NewPlayerComponent;
	@ViewChild(PlayerPersonalDataComponent)
	playerPersonalDataComponent: PlayerPersonalDataComponent;
	@ViewChild(PlayerContactDataComponent)
	playerContactDataComponent: PlayerContactDataComponent;
	@ViewChild(PlayerSportingDataComponent)
	playerSportingDataComponent: PlayerSportingDataComponent;
	@ViewChild(PlayerFamilyDataComponent)
	playerFamilyDataComponent: PlayerFamilyDataComponent;
	@ViewChild(NewAgentComponent)
	newAgentComponent: NewAgentComponent;
	@ViewChild(AlumnAcademicDataComponent)
	alumnAcademicDataComponent: AlumnAcademicDataComponent;
	@ViewChild(AlumnSportingDataComponent)
	alumnSportingDataComponent: AlumnAcademicDataComponent;

	constructor(
		private playerService: PlayersService,
		private appStateQuery: AppStateQuery,
		private trasnlateService: TranslateService,
		private alumnsService: AlumnsService,
		private appStateService: AppStateService,
		public msg: AlertsApiService
	) {
		this.role = localStorage.getItem('role') as 'sport' | 'teacher';
		this.loadSteps();
	}

	getScreenWidth(): any {
		return screen.width;
	}

	closeDialog() {
		this.advancedDialog = false;
		this.close.emit(false);
	}

	ngOnInit(): void {
		this.subs = this.appStateQuery.team$.subscribe((res) => {
			this.team = res;
			this.data.gender = res.gender_id;
		});
	}

	selectItem(id: number) {
		this.selectStep = id;
	}

	nextStep(event: any) {
		const id = this.selectStep;
		this.steps[id].disabled = false;
		if (id >= 2) {
			this.steps.map((x) => {
				x.disabled = false;
			});
		}
		if (this.selectStep > 4) {
			this.formData = Object.assign(this.formData, event);
			this.data = Object.assign({}, this.formData);
			return;
		}
		this.selectStep++;
		this.formData = Object.assign(this.formData, event);
		this.data = Object.assign({}, this.formData);
	}

	next(data: any) {
		this.player = data;

		this.step = 2;
	}

	loadSteps() {
		this.steps = [
			{
				title: this.trasnlateService.instant('PLAYERS.datospersonalestitle'),
				subtitle: this.trasnlateService.instant(
					this.role === 'sport'
						? 'PLAYERS.datospersonalessubtitle'
						: 'PLAYERS.datospersonalessubtitleAlumn'
				),
				contentTitle: this.trasnlateService.instant(
					'PLAYERS.datospersonalescontent'
				),
				icon: 'datos-personales-innactive.png',
				icon_active: 'datos-personales-active.png',
				selected: true,
				disabled: false,
			},
			{
				title: this.trasnlateService.instant('PLAYERS.datosdeportivostitle'),
				subtitle: this.trasnlateService.instant(
					'PLAYERS.datosdeportivossubtitle'
				),
				contentTitle: this.trasnlateService.instant(
					'PLAYERS.datosdeportivoscontent'
				),
				icon: 'muscle.png',
				icon_active: 'muscle-active.png',
				selected: true,
				disabled: true,
			},
			{
				title: this.trasnlateService.instant('PLAYERS.datoscontactotitle'),
				subtitle: this.trasnlateService.instant(
					'PLAYERS.datoscontactosubtitle'
				),
				contentTitle: this.trasnlateService.instant(
					'PLAYERS.datoscontactocontent'
				),
				icon: 'datos-contacto-innactive.png',
				icon_active: 'datos-contacto-active.png',
				disabled: true,
			},
			{
				title: this.trasnlateService.instant('PLAYERS.datosfamiliarestitle'),
				subtitle: this.trasnlateService.instant(
					'PLAYERS.datosfamiliaressubtitle'
				),
				contentTitle: this.trasnlateService.instant(
					'PLAYERS.datosfamiliarescontent'
				),
				icon: 'family.png',
				icon_active: 'family-active.png',
				disabled: true,
			},
			{
				title: this.trasnlateService.instant('PLAYERS.datoslaboralestitle'),
				subtitle: this.trasnlateService.instant(
					'PLAYERS.datoslaboralessubtitle'
				),
				contentTitle: this.trasnlateService.instant(
					'PLAYERS.datoslaboralescontent'
				),
				icon: 'datos-laborales-innactive.png',
				icon_active: 'datos-laborales-active.png',
				disabled: true,
			},
		];
		if (this.role === 'teacher') {
			this.steps.splice(1, 0, {
				title: this.trasnlateService.instant('PLAYERS.datosacademicostitle'),
				subtitle: this.trasnlateService.instant(
					'PLAYERS.datosacademicossubtitle'
				),
				contentTitle: this.trasnlateService.instant(
					'PLAYERS.datosacademicoscontent'
				),
				icon: 'datos-laborales-innactive.png',
				icon_active: 'datos-laborales-active.png',
				disabled: true,
			});
			this.steps.pop();
		}
	}

	savePlayer(event: any) {
		this.formData = Object.assign(this.formData, event);
		this.formData.team_id = this.team.id;
		this.saving = true;
		if (this.formData.id) {
		} else {
			if (this.role === 'teacher') {
				this.alumnsService
					.add(this.formData, this.appStateService.getClassroomAcademicYear())
					.then((r) => {
						this.saving = false;
						this.close.emit(true);
					})
					.catch((error) => {
						this.saving = false;
						this.error.handleError(
							error,
							this.trasnlateService.instant('PLAYERS.ERRORCREATIONALUMN')
						);
					});
			} else {
				this.playerService
					.add(this.formData)
					.then((r) => {
						this.saving = false;
						this.close.emit(true);
					})
					.catch((error) => {
						this.saving = false;
						this.error.handleError(
							error,
							this.trasnlateService.instant('PLAYERS.ERRORCREATION')
						);
					});
			}
		}
	}

	handleNext() {
		if (this.step < 2) {

			this.newPlayer.onSubmit();
			return;
		}
		this.saving = true;

		if (this.role === 'sport' && this.team.gender_id > 0) {
			this.player.gender_id = this.team?.gender_id;
		};


		this.player.team_id = this.team.id;
		if (this.imagen && this.imagenPreview) {
			this.player.image = this.imagen;
		}
		if (this.role === 'teacher') {
			this.alumnsService
				.add(this.player, this.appStateService.getClassroomAcademicYear())
				.then((r) => {
					this.close.emit(true);
					this.saving = false;
				})
				.catch(({ error }) => {
					this.saving = false;
					this.error.handleError(
						error,
						this.trasnlateService.instant('PLAYERS.ERRORCREATIONALUMN')
					);
				});
		} else {
			this.playerService
				.add(this.player)
				.then((r) => {
					this.close.emit(true);
					this.saving = false;
				})
				.catch((er) => {
					this.saving = false;
					this.error.handleError(
						er,
						this.trasnlateService.instant('PLAYERS.ERRORCREATION')
					);
				});
		}
	}

	async fileUpload(file: any) {
		this.imagen = file;
		this.preview(file);
		this.openCropperDialog = false;
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

	handleNextAdvance() {
		switch (this.selectStep) {
			case 1:
				this.playerPersonalDataComponent.onSubmit();
				return;
			case 2:
				if (this.role === 'teacher') {
					this.alumnAcademicDataComponent.onSubmit();
				} else {
					this.playerSportingDataComponent.onSubmit();
				}
				return;
			case 3:
				if (this.role === 'teacher') {
					this.alumnSportingDataComponent.onSubmit();
				} else {
					this.playerContactDataComponent.onSubmit();
				}
				return;
			case 4:
				if (this.role === 'teacher') {
					this.playerContactDataComponent.onSubmit();
				} else {
					this.playerFamilyDataComponent.onSubmit();
				}
				return;
			case 5:
				this.saving = true;
				if (this.role === 'teacher') {
					this.playerFamilyDataComponent.onSubmit();
				} else {
					this.newAgentComponent.handleSave();
				}
				return;
			default:
				return;
		}
	}

	saveData(event: any) {
		this.formData = Object.assign(this.formData, event);
		this.data = Object.assign({}, this.formData);
	}
}
