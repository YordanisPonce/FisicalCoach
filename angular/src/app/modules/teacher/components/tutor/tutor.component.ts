import { Component, OnInit } from '@angular/core';
import { TutorshipService } from 'src/app/_services/tutorship.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
// import {MenuItem} from 'primeng/api';
import { environment } from 'src/environments/environment';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss'],
  providers: [DatePipe],
})
export class TutorComponent implements OnInit {
  constructor(
    private appStateQuery: AppStateQuery,
    private translate: TranslateService,
    private tutorshipService: TutorshipService,
    private appStateService: AppStateService,
    private datePipe: DatePipe
  ) {}

  enviromentUrl: string = environment.API_URL;
  loading: boolean = false;
  newTutorshipDialog: boolean = false;
  students: any = [];
  studentsList: any = [];
  selectedStudent: any = [];
  selectedIndex: any = null;
  editingTutorship: boolean = false;
  dateValue: string | null | Date = null;

  urlImages = environment.images;
  girlAlumnImage: string = this.urlImages + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.urlImages + 'images/alumn/alumno.svg';

  searchAlumn(event: any) {
    const search = event.target.value.toLowerCase();
    const filter = this.studentsList.filter((item: any) =>
      item.full_name?.toLowerCase().includes(search)
    );

    if (search.length > 0) {
      this.students = filter;
    } else {
      this.students = this.studentsList;
    }
  }

  onRowSelect(student: any, index: number) {
    this.selectedStudent = [student];
    this.selectedIndex = index;
  }

  getStudentsList() {
    this.tutorshipService
      .getTutorshipList(this.appStateService.getSchool().id)
      .subscribe((res: any) => {
        // console.log(res)
        this.students = this.studentsList = res.data.map((item: any) => ({
          ...item,
          tutorshitData: item.tutorships[0],
          tutorshipType: item.tutorships[0]?.tutorship_type,
        }));
        this.loading = false;
        console.log(this.students);
      });
  }

  loadTutorship(tutorship: any, edit?: boolean) {
    // console.log(tutorship)
    this.selectedStudent[0] = tutorship;
    if (edit) {
      this.editingTutorship = true;
      this.dateValue = new Date(tutorship.tutorships[0].date);
    }
    this.newTutorshipDialog = true;
  }

  deleteTutorship(tutorshipId: string) {
    this.tutorshipService.deleteTutorship(tutorshipId).subscribe((res: any) => {
      // console.log(res)
      this.loading = true;
      this.getStudentsList();
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.getStudentsList();
  }
}
