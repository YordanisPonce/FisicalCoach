import { AlertsApiService } from '../generals-services/alerts-api.service';

export default class HandleErrors {
  constructor( private msg: AlertsApiService ) {
  }

  handleError( error: any, defaulMsg: string ) {
    let err: any = null;
    if ( ( error instanceof String ) || typeof error ==='string') {
      try {
        err = JSON.parse( error as any );
      } catch ( er ) {
        console.log( er );
        this.msg.error( defaulMsg );
        return;
      }
    } else {
      err = error;
    }
    let msg = '';
    if ( err.errors ) {
      const keys = Object.keys( err.errors );
      keys.map( x => {
        msg = msg + x + ' : ' + err.errors[ x ][ 0 ] + '\n   ';
      } );
      this.msg.error( msg );
      return;
    } else if ( err.error?.message ) {
      this.msg.error( err.error?.message );
      return;
    } else if ( err.message ) {
      this.msg.error( err.message );
      return;
    } else {
      this.msg.error( defaulMsg );
      return;
    }

  }

}
