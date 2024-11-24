import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rubrics-list-dialog',
  templateUrl: './rubrics-list-dialog.component.html',
  styleUrls: ['./rubrics-list-dialog.component.scss']
})
export class RubricsListDialogComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
  
  @Input() visible:boolean = false
  @Input() rubrics:any = []
  @Output() close = new EventEmitter<boolean>()
  @Output() create = new EventEmitter<boolean>()
  @Output() associateRubric = new EventEmitter<boolean>()
  @Output() editRubric = new EventEmitter<any>()
  @Output() exportRubric = new EventEmitter<any>()
  selectedRubric: any = null

  createIndicator(){
    this.create.emit(true)
    console.log("nuevo indicador")
  }

  associateRubricToClass(){
    this.associateRubric.emit(true)
    console.log(this.selectedRubric)
    this.exportRubric.emit(this.selectedRubric)
    
  }

  setRubricToExport(rubric?:any){
    this.selectedRubric = rubric
    this.exportRubric.emit(rubric)
  }

  edit(){
    this.editRubric.emit(this.selectedRubric)    
  }

  closeDialog(){
    this.selectedRubric = null
    this.close.emit(false)
  }

}
