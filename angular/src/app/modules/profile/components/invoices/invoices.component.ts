import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Licence, Package } from 'src/app/_models/user';
import { UsersService } from 'src/app/_services/users.service';
import { InvoiceService } from '../../../../_services/invoice.service';
import { InvoiceInterface } from '../../../../_models/invoice.interface';
import { ResponseInterface } from '../../../../_models/response.interface';

@Component( {
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: [ './invoices.component.scss' ],
} )
export class InvoicesComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() hide: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  invoices: Licence[] = [];
  invoicesList: InvoiceInterface[] = [];
  role: string = '';
  loading: boolean = false;
  options: any = {};
  downloading: boolean = false;
  
  constructor( private userService: UsersService,
               private invoiceService: InvoiceService,
               private msg: AlertsApiService ) {
  }
  
  ngOnInit(): void {
    this.role = localStorage.getItem( 'role' ) as string;
    this.getAllinvoices();
    
  }
  
  /**
   * close dialog
   */
  close(): void {
    this.hide.emit( false );
  }
  
  download( item: InvoiceInterface ) {
    this.downloading = true;
    this.invoiceService.downloadPDF( item.invoice_number ).subscribe( ( res: any ) => {
      const a = document.createElement( 'a' );
      const objectUrl = URL.createObjectURL( res );
      a.href = objectUrl;
      a.download = `${ item.invoice_number }.pdf`;
      a.click();
      URL.revokeObjectURL( objectUrl );
      this.downloading = false;
    }, ( { error } ) => {
      this.msg.error( error );
      this.downloading = false;
    } );
  }
  
  send() {
    // const env = {
    //   package_price_id: localStorage.getItem('idsus'),
    //   interval: localStorage.getItem('typ'),
    //   quantity: this.numero,
    //   payment_method_token: this.enviado,
    //   user_id: localStorage.getItem('uvr'),
    // };
    // this.http.sendSubscripcion(env).subscribe(
    //   (data: any) => {
    //     if (data.success === true) {
    //       $('#exampleModalStripe').modal('hide');
    //       this.msj.succes(data.message);
    //       this.router.navigateByUrl('login');
    //       localStorage.clear();
    //     }
    //     this.loading = false;
    //   },
    //   ({ error }) => {
    //     this.msj.error(error);
    //     this.loading = false;
    //   }
    // );
  }
  
  closeDialog(): void {
    this.hide.emit( false );
  }
  
  private getAllinvoices() {
    this.invoiceService.getAllInvoices().subscribe( ( res: ResponseInterface<InvoiceInterface> ) => {
      this.invoicesList = res.data as InvoiceInterface[];
    } );
  }
}
