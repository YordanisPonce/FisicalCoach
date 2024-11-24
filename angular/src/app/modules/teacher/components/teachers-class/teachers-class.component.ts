import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Staff } from 'src/app/_models/team';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'teachers-class',
  templateUrl: './teachers-class.component.html',
  styleUrls: ['./teachers-class.component.scss']
})
export class TeachersClassComponent implements OnInit {

  constructor() { }

  @Input() staff: Staff[] = [];
  @Input() loadingStaff: boolean = false

  @Output() view = new EventEmitter<any>()
  @Output() edit = new EventEmitter<any>()
  @Output() remove = new EventEmitter<any>()

  urlBase = environment.images;


  ngOnInit(): void {
  }

  deallocate(person: any) {
    this.remove.emit({
      teacher_id: person.teacher.id,
      subject_id: person.subject.id,
    })
  }

}