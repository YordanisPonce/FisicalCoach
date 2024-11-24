import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Package } from 'src/app/_models/package';
import { ProfieService } from 'src/app/modules/profile/profile-services/profie.service';
import { EditPlanModalComponent } from '../../../../components/edit-plan-modal/edit-plan-modal.component';
// import { EditPlanModalComponent } from '../edit-plan-modal/edit-plan-modal.component';

@Component({
  selector: 'app-admin-sport-pack',
  templateUrl: './admin-sport-pack.component.html',
  styleUrls: ['./admin-sport-pack.component.scss']
})
export class AdminSportPackComponent implements OnInit, OnDestroy {
  p: number = 1;
  itemsPerPage = 10; // Valor inicial
  public packages: Package[] = [];
  public subscription$: Subscription;
  defaultSubpackage: string;
  icons: any = {
    sport_bronze: '/assets/img/icons/sport_bronze.svg',
    sport_silver: '/assets/img/icons/sport_silver.svg',
    sport_gold: '/assets/img/icons/sport_gold.svg',
  };
  dialogVisible: boolean = false;
  subpackageData: any = {};

  constructor(private http: ProfieService, private dialog: MatDialog) {}

  ngOnInit(): void {

    this.getSubscriptionPackages();
    this.defaultSubpackage = 'codigo-de-subpaquete-por-defecto';

  }

  showDialog(subpackage: any) {
    // console.log('subpackage >>>>>', subpackage);
    
    this.dialogVisible = true;
    this.subpackageData = subpackage
    console.log('dialogVisible >>>>>', this.dialogVisible);

    // console.log('subpackageData >>>>>', this.subpackageData);

    /* const dialogRef = this.dialog.open(EditPlanModalComponent, {
      width: '250px',
      panelClass: 'mi-modal',
      data: { selectedPackage: subpackage }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de edición de plan se cerró');
      // Aquí puedes manejar lo que sucede después de que el modal se cierra
    }); */
  }

  hideDialog(event: any) {
    this.dialogVisible = false;
    /* if (event) {
      this.cargarJugadores();
    } */
  }

  private getSubscriptionPackages(): void {
    this.subscription$ = this.http.getPackeges().subscribe((res: any) => {
      this.packages = res.data;
      console.log(this.packages);//aqui obtengo todos los paquetes y arriba los paso al modal
    });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
