import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component( {
  selector: 'app-table-pays',
  templateUrl: './table-pays.component.html',
  styleUrls: [ './table-pays.component.scss' ],
} )
export class TablePaysComponent implements OnInit {
  public items: any = [];
  public datoOne: any = [];
  public types: any = '';
  suscriptionPlans: any[];
  value: any;
  language: string = 'es';
  resources = environment.images + 'images/icons/';
  codeImage: any = {
    'sport_bronze': 'sport_bronze.svg',
    'sport_silver': 'sport_silver.svg',
    'sport_gold': 'sport_gold.svg',
    'sport_personalized': 'sport_personalized.svg',
    'teacher_bronze': 'teacher_bronze.svg',
    'teacher_silver': 'teacher_silver.svg',
    'teacher_gold': 'teacher_gold.svg',
    'teacher_personalized': 'teacher_personalized.svg',
  };

  constructor( public ruter: Router, private translate: TranslateService ) {
    this.suscriptionPlans = [
      {
        name: 'GOLD',
        price: '€15,99',
        icon: 'crown.svg',
      },
      {
        name: 'SILVER',
        price: '€9,99',
        icon: 'crown_silver.svg',
      },
      {
        name: 'BRONZE',
        price: '€5,99',
        icon: 'crown_bronze.svg',
      },
      {
        name: 'STANDAR',
        price: 'Gratis',
      },
    ];
  }

  ngOnInit(): void {
    this.types = localStorage.getItem( 'typ' );
    const tem: any = localStorage.getItem( 'item' );
    this.items = JSON.parse( tem );
    if ( this.items ) {
      this.datoOne = this.items.subpackages[ 0 ];

      console.log(this.datoOne)
    }
    this.language = localStorage.getItem( 'languaje' ) as string;
  }

  getIcon( code: string ): any {
    return this.resources + this.codeImage[ code ];
  }

  ir( item: any, name: any ) {
    localStorage.setItem( 'icon', this.getIcon( item.code ) );
    localStorage.setItem( 'name', item.code );
    localStorage.setItem( 'plan', JSON.stringify(item.prices) );
    this.ruter.navigateByUrl( 'register/pays-metos' );
  }

  selectid( id: any ) {
    localStorage.setItem( 'idsus', id );
  }

  handleLanguage( value: any ) {
    localStorage.setItem( 'languaje', value.target.value );
    this.translate.setDefaultLang( value.target.value );
  }
}
