import { Component, OnInit,OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-register-leveles',
  templateUrl: './register-leveles.component.html',
  styleUrls: ['./register-leveles.component.scss']
})
export class RegisterLevelesComponent implements OnInit, OnDestroy {
public idioma: any = "";
  constructor(private translate : TranslateService) {
	
       if(localStorage.getItem('languaje')){      
	this.translate.setDefaultLang(`${localStorage.getItem('languaje')}`);
	this.idioma = localStorage.getItem('languaje')
       }else{
         localStorage.setItem('languaje','es')
	this.translate.setDefaultLang('es')
	}
 }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    localStorage.clear()
  }
}
