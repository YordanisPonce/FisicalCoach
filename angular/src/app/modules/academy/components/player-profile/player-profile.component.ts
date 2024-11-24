import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss']
})
export class PlayerProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  items!: MenuItem[];
  activeTab!:number

  setActiveTab = (string:any) => {
    let tab:any = this.items.find(element => element.routerLink == string)
    this.activeTab = this.items.indexOf(tab)        
  }

  ngOnInit(): void {
    
    this.items = [
      {label: '<img src="assets/img/icons/user-selected.png" class="">General', escape: false, routerLink: 'general'},
      {label: '<img src="assets/img/icons/google-forms-selected.svg" class="">Información', escape: false, routerLink: 'informacion'},
      {label: '<img src="assets/img/icons/cardiogram.svg" class="">Estado de salud', escape: false, routerLink: 'estado-de-salud'},
      {label: '<img src="assets/img/icons/user.png" class="">Competición', escape: false, routerLink: 'competicion'},
      {label: '<img src="assets/img/icons/user.png" class="">Carga de entrenamiento', escape: false, routerLink: 'carga-de-entrenamiento'},
    ];

    let route = this.route.firstChild?.snapshot.routeConfig
    if(route!=null){
      // console.log(route.path)
      // console.log(this.activeTab(route.path))
      this.setActiveTab(route.path)
    }
  }

}
