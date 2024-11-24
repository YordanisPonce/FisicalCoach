import { Component, OnInit } from '@angular/core';
import { TutorshipService } from 'src/app/_services/tutorship.service';
import { SchoolService } from 'src/app/_services/school.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-tutorships-record',
  templateUrl: './tutorships-record.component.html',
  styleUrls: ['./tutorships-record.component.scss']
})
export class TutorshipsRecordComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appStateQuery: AppStateQuery,
    private translate: TranslateService,
    private tutorshipService : TutorshipService,
    private schoolService : SchoolService,
    // private datePipe : DatePipe,
  ) { }

  loading:boolean = false
  tutorshipRecords:any = null
  loadingItems:any = [1,2,3]
  urlImages = environment.images
  girlAlumnImage:string = this.urlImages+'images/alumn/alumna.svg'
  boyAlumnImage:string = this.urlImages+'images/alumn/alumno.svg'

  tutorshipToEdit:any

  newTutorshipDialog:boolean = false
  tutorshipDetails:any
  editingTutorship:boolean = false


  getTutorshipDetails(){
    const alumnId = this.route.snapshot.paramMap.get('alumnId')!;
    this.tutorshipService.getTutorshipsRecord(alumnId).subscribe((res:any) => {
      // console.log(res)
      this.tutorshipRecords = res.data
      this.loading = false
    })
  }

  download(tutorshipId:string){
    this.tutorshipService.getTutorshipPdf(tutorshipId).subscribe((res:any) => {
      // console.log(res)
      const blob = new Blob([res], { type: 'application/pdf' })
      // const fileUrl = URL.createObjectURL(blob);
      // window.open(fileUrl, '_blank');
      saveAs(blob, "tutorship.pdf");
      // console.log(res)
    })    
  }

  deleteTutorship(tutorshipId:string){
    this.tutorshipService.deleteTutorship(tutorshipId).subscribe((res:any) => {
      // console.log(res)
      this.loading = true
      // this.getStudentsList()
      // this.router.navigate(['/teacher/tutor']);
      this.getTutorshipDetails()
    })
  }

  ngOnInit(): void {
    this.loading = true
    this.getTutorshipDetails()

  }

}
