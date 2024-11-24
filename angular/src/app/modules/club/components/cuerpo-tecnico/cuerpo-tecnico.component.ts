import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Staff } from 'src/app/_models/team';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'cuerpo-tecnico-component',
  templateUrl: './cuerpo-tecnico.component.html',
  styleUrls: ['./cuerpo-tecnico.component.scss']
})
export class CuerpoTecnicoComponent implements OnInit {

  constructor() { }


  @Input() staff: Staff[] = [];
  @Input() loadingStaff:boolean = false

  @Output() view = new EventEmitter<any>()
  @Output() edit = new EventEmitter<any>()
  @Output() remove = new EventEmitter<any>()

  urlBase = environment.images;
  girlPlayerImage: string = this.urlBase + 'images/teachers/profesora.svg';
  boyPlayerImage: string = this.urlBase + 'images/teachers/profesor.svg';


  ngOnInit(): void {
  }

}
