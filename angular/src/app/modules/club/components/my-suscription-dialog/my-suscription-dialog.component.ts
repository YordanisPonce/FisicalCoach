import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProfieService } from '../../../profile/profile-services/profie.service';
import { forkJoin } from 'rxjs';

interface City {
  name: string;
  code: string;
}

@Component( {
  selector: 'app-my-suscription-dialog',
  templateUrl: './my-suscription-dialog.component.html',
  styleUrls: [ './my-suscription-dialog.component.scss' ]
} )
export class MySuscriptionDialogComponent implements OnInit {

  step: number = 1;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  cities: City[];
  selectedCity!: any;
  players: boolean = false;
  justifyOptions: any[];
  subpaqueteSeleccionado: any;
  dataSuscrippcionUser: any;
  subpaquetes: any[] = [];
  cargando: boolean = true;

  constructor( private profieService: ProfieService ) {
    this.justifyOptions = [
      { icon: 'pi pi-align-left', justify: 'Left' },
      { icon: 'pi pi-align-right', justify: 'Right' },
      { icon: 'pi pi-align-center', justify: 'Center' },
    ];
  }

  closeDialog() {
    this.close.emit( false );
  }

  ngOnInit(): void {
    const tem: any = localStorage.getItem( 'subs' );
    this.dataSuscrippcionUser = JSON.parse( tem );
    forkJoin(
      this.profieService.getProfile(),
      this.profieService.getPackeges()
    ).subscribe( ( [ susbcriptionAcitve, packages ] ) => {
      const temp =  susbcriptionAcitve as any;
      const subscriptionActive = temp.data.subscription_active as any;
      const paquetes = packages as any;
      paquetes.data.map( ( p: any ) => {
        p.subpackages.map( ( sp: any ) => {
          if ( this.dataSuscrippcionUser && sp.code === subscriptionActive.package_price?.subpackage?.code ) {
            this.subpaquetes = p.subpackages;
            this.subpaqueteSeleccionado = sp;
          }
          this.cargando = false;
        } );
      } );
    } );
  }

}
