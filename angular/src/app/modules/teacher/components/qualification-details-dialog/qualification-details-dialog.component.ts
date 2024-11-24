import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { QualificationService } from 'src/app/_services/qualification.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'qualification-details-dialog',
  templateUrl: './qualification-details-dialog.component.html',
  styleUrls: ['./qualification-details-dialog.component.scss'],
})
export class QualificationDetailsDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() loadingPDF: boolean = false;
  @Input() details: any;
  @Input() qualificationId: any;
  @Input() alumnId: any;
  @Input() alumnName: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() created = new EventEmitter<boolean>();
  @Output() edited = new EventEmitter<boolean>();

  periods: any;
  periodId: string;
  qualification: any;
  images: string = environment.images;
  loading: boolean = false;


  constructor(
    private qualificationService: QualificationService,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.periods =
      this.appStateService.getClass().active_academic_years.academic_periods;
  }

  closeDialog() {
    this.close.emit(false);
    this.qualificationId = undefined;
    this.qualification = undefined;
  }

  getCompetenceKey(key: string, abbr?: boolean) {
    if (key == 'POR EVALUAR' || key == 'UNRATED') return;
    const SPLIT_KEY = key.split('(');

    const ABBR = SPLIT_KEY[1].split(')')[0];
    if (abbr) {
      return ABBR;
    } else {
      return SPLIT_KEY[0];
    }
  }

  getItem(id: string) {
    const item = this.qualification.qualification.qualification_items.find(
      (item: any) => item.id === id
    );
    return item;
  }

  getQualificationResume() {
    this.loading = true;
    this.qualificationService
      .getQualificationResume(
        this.qualificationId,
        this.alumnId,
        this.appStateService.getClassroomAcademicYear()
      )
      .subscribe(
        (res: any) => {
          this.qualification = res.data;
          console.log(this.qualification);
          this.periodId = res.data.qualification.classroom_academic_period_id;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }
  downloadPDFDetails({ qualification }: any, alumnId: string) {
    this.loadingPDF = true

    this.qualificationService.getPDFDetails(alumnId, qualification.classroom_academic_year_id, qualification.id )
    .subscribe(
      (res) => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(res)
        a.href = objectUrl
        a.download = `${qualification.title}.pdf`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.loadingPDF = false
      },
      ({error}) => {
        this.msg.error(error);
        this.loadingPDF = false;
      }
    );
  }

  handleCalifications(grade: string): { color: string; icon: string; text: string; label: string; value: string } {
    const parseGrade: number = parseInt(grade);
    const url = "https://testing-cdn.fisicalcoach.com/resources/images/face"

    if (parseGrade <= 4) {
      return {
        text: 'insufficient (1-4)',
        value: ' (1-4)',
        label: 'insufficient',
        color: '#F94C46',
        icon: `${url}/1_red_face.svg`,
      };
    }

    if (parseGrade > 4 && parseGrade <= 6) {
      return {
        text: 'sufficient (5-6)',
        value: ' (5-6)',
        label: 'sufficient',
        color: '#c8d16b',
        icon: `${url}/3_yellow_face.svg`,
      };
    }

    if (parseGrade > 6 && parseGrade <= 8) {
      return {
        text: 'notable (7-8)',
        value: ' (7-8)',
        label: 'notable',
        color: '#A9E6FF',
        icon: `${url}/4_Blue_face.svg`,
      };
    }

    if (parseGrade > 8 && parseGrade <= 10) {
      return {
        text: 'outstanding (9-10)',
        value: ' (9-10)',
        label: 'outstanding',
        color: '#9AF9E9',
        icon: `${url}/5_green_face.svg`,
      };
    }

    return {
      text: '',
      value: '',
      label: '',
      color: '',
      icon: '',
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.qualificationId) {
      if (
        changes.qualificationId.currentValue !== undefined &&
        changes.qualificationId.currentValue !== null
      ) {
        this.getQualificationResume();
      }
    }
  }
}
