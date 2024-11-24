import { ServicesService } from '../login/services.service';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable( {
  providedIn: 'root'
} )
export class AlertsApiService {

  constructor( public http: ServicesService ) {
  }

  succes( msg: any ) {

    Swal.fire( {
      icon: 'success',
      text: msg,
      iconColor: '#00E9C5',
      showConfirmButton: false,
      timer: 1500
    } );
  }

  error( error: any, time: number = 3000 ) {
    if ( error?.errors ) {
      const errors = Object.values( error?.errors ).map( item => ( `<br /><li style="text-align: left;">${ item }</li>` ) );
      const errorList: any = `<ul>${ errors }</ul>`;
      Swal.fire( {
        icon: 'error',
        html: errorList,
        showConfirmButton: false,
        timer: time
      } );

    } else if ( error?.data ) {
      Swal.fire( {
        icon: 'error',
        html: error?.data,
        showConfirmButton: false,
        timer: time
      } );
    } else if ( error?.message ) {
      Swal.fire( {
        icon: 'error',
        html: error?.message,
        showConfirmButton: false,
        timer: time
      } );
    } else {
      Swal.fire( {
        icon: 'error',
        html: error || 'Ha ocurrido un error',
        showConfirmButton: false,
        timer: time
      } );
    }
  }

  recuperate() {
    Swal.fire( {
      title: 'Ingresa tu Correo',
      input: 'text',
      confirmButtonText: 'enviar',
      preConfirm: ( login ) => {

      },
      allowOutsideClick: () => !Swal.isLoading()
    } ).then( ( result ) => {
      if ( result.isConfirmed ) {
        this.http.recuperatePass( result.value ).subscribe( ( data: any ) => {
          this.succes( 'Revise su bandeja de entrada' );
        }, err => {
          this.error( 'Ocurrio un error inesperado' );
        } );
      }
    } );
  }
}
