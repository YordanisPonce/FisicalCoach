import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CreatePlanModalComponent } from './components/create-plan-modal/create-plan-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-plans',
  templateUrl: './admin-plans.component.html',
  styleUrls: ['./admin-plans.component.scss']
})
export class AdminPlansComponent {
  dialogVisible: boolean = false;
  subpackageData: any = {};
  activeItem: any = null;
  public idioma: any = '';
  private _router: Router; 
  items = [
    {
      label: 'Deporte',
      routerLink: ['sport'], // actualiza esto con la ruta correcta
      icon: 'assets/img/icons/sport.svg', // añade la ruta a tu icono aquí
      iconSelect: 'assets/img/icons/sportselect.svg', // añade la ruta a tu icono seleccionado aquí
    },
    {
      label: 'Profesor',
      routerLink: ['teacher'], // actualiza esto con la ruta correcta
      icon: 'assets/img/icons/teacher.svg', // añade la ruta a tu icono aquí
      iconSelect: 'assets/img/icons/teacherselect.svg', // añade la ruta a tu icono seleccionado aquí
    },
  ];


  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialog: MatDialog

  ) {this.setTranslate();}

  handleTab(tab: any): MenuItem {
    return tab;
  }

  getIcon(item: any) {
    if (this.router.url === item.routerLink[0]) {
      return item.iconSelect;
    } else {
      return item.icon;
    }
  }

  private setTranslate() {
    if (localStorage.getItem('languaje')) {
      this.translate.setDefaultLang(`${localStorage.getItem('languaje')}`);
      this.idioma = localStorage.getItem('languaje');
    } else {
      this.translate.setDefaultLang('es');
    }
  }

  showCreatePlanDialog() {
    const dialogRef = this.dialog.open(CreatePlanModalComponent, {


      panelClass: 'mi-modal',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de edición de plan se cerró');
      // Aquí puedes manejar lo que sucede después de que el modal se cierra
    });
  }

  showDialog(subpackage: any) {
    // console.log('subpackage >>>>>', subpackage);
    
    this.dialogVisible = true;
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
  

  
}