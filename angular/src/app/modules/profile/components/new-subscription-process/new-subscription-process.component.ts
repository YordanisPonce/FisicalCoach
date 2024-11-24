import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/_services/general.service';
import { AppStateService } from '../../../../stateManagement/appState.service';
import { ServicesService } from '../../../register-leveles/services/services.service';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';

@Component( {
  selector: 'app-new-subscription-process',
  templateUrl: './new-subscription-process.component.html',
  styleUrls: [ './new-subscription-process.component.scss' ]
} )
export class NewSubscriptionProcessComponent implements OnInit {

  items: any = [];
  firstPackage: any = [];
  types: any = '';
  step: number = 1;
  datos: any = [];
  code: any = '';
  id: any = '';
  max_licenses: any = '';
  min_licenses: any = '';
  price: any = '';
  priceOne: any = '';
  name: any = '';
  subpackage_id: any = '';
  posicion: any = 1;
  title: any = '';
  total: any = '';
  icon: any = '';
  userInfo: any;
  packageId: number;
  tax: number = 0;
  paymentDialog: boolean = false;
  intervalType: string;
  subscriptionData: any;
  plan: any;
  suscriptionPlans: any[];
  value: any;
  type = JSON.parse(localStorage.getItem( 'item' ) as string).code;
  paymentMethod: any;
  loading: boolean = false;

  constructor( public router: Router,
               public http: ServicesService,
               public msj: AlertsApiService,
               private appStateService: AppStateService ) {

    this.suscriptionPlans = [
      {
        name: 'GOLD',
        price: '€15,99',
        icon: 'crown.svg'
      },
      {
        name: 'SILVER',
        price: '€9,99',
        icon: 'crown_silver.svg'
      },
      {
        name: 'BRONZE',
        price: '€5,99',
        icon: 'crown_bronze.svg'
      },
      {
        name: 'STANDAR',
        price: 'Gratis',
      },
    ];

    if ( this.router.getCurrentNavigation()?.extras.state ) {
      this.intervalType = this.router.getCurrentNavigation()?.extras.state?.interval_type;
      this.subscriptionData = this.router.getCurrentNavigation()?.extras.state?.subscriptionData;
      this.firstPackage = this.subscriptionData.subpackages[ 0 ];
    } else {
      this.router.navigate( [ '/profile/subscriptions' ] );
    }
  }

  ngOnInit(): void {
    this.paymentMethod = JSON.parse( localStorage.getItem( 'peymentMethod' ) as string );
    console.log(this.type)
  }

  /**
   * save plan information and go to payment step
   * @param item
   * @param name
   */
  goToPayment( item: any, name: string, packageId: number ) {
    let icon: string = '';
    if ( item.code === 'sport_gold' || item.code === 'teacher_gold' ) {
      icon = '/assets/img/icons/' + this.suscriptionPlans[ 0 ].icon;
    } else if ( item.code === 'sport_silver' || item.code === 'teacher_silver' ) {
      icon = '/assets/img/icons/' + this.suscriptionPlans[ 1 ].icon;
    } else {
      icon = '/assets/img/icons/' + this.suscriptionPlans[ 2 ].icon;
    }
    this.icon = icon;
    this.title = name;
    this.packageId = packageId;
    this.plan = item;
    this.userInfo = JSON.parse( localStorage.getItem( 'user' ) as string );
    this.selectPlan();
    this.getTax();
    this.step = 2;
  }


  /**
   * get taxes
   */
  getTax(): void {
    const taxes = this.appStateService.getTax();
    const taxValue = Number( taxes.value ) || 0;
    this.tax = taxValue || 0;
    this.total = ( ( this.price * ( this.tax / 100 ) ) + this.price ).toFixed( 2 );
  }

  selectPlan( post: any = 0 ) {
    if ( this.posicion + post >= 1 ) {
      this.posicion = this.posicion + post;
      for ( const i in this.plan ) {
        if ( Number( this.plan[ i ].max_licenses ) >= this.posicion && Number( this.plan[ i ].min_licenses ) <= this.posicion ) {
          this.name = this.plan[ i ].name;
          this.packageId = this.plan[ i ].id;
          if ( this.intervalType === 'year' ) {
            this.priceOne = this.plan[ i ].year;
            this.price = this.plan[ i ].year * this.posicion;
            this.total = ( ( this.price * ( this.tax / 100 ) ) + this.price ).toFixed( 2 );
          } else if ( this.intervalType === 'month' ) {
            this.priceOne = this.plan[ i ].month;
            this.price = this.plan[ i ].month * this.posicion;
            this.total = ( ( this.price * ( this.tax / 100 ) ) + this.price ).toFixed( 2 );
          }
        }
      }
    }
  }

  showModalPayment() {
    if ( this.paymentMethod ) {
      this.send();
    } else {
      this.paymentDialog = true;
    }
  }


  send() {
    const env = {
      package_price_id: this.packageId,
      interval: this.intervalType,
      quantity: this.posicion,
      payment_method_token: this.paymentMethod.id,
      user_id: this.userInfo.id,
      type: this.type
    };
    this.loading = true;
    this.http.sendSubscripcion( env ).subscribe( ( data: any ) => {
      this.loading = false;
      if ( data.success === true ) {
        this.msj.succes( 'Su subscripcion ha sido creada' );
        setTimeout( () => {
          window.location.replace( '/profile/subscriptions' );
        }, 500 );
      }
    }, ( { error } ) => {
      this.loading = false;
      this.msj.error( error );
    } );
  }
}
