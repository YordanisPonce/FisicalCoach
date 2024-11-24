import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanService } from '../../services/plan-service/plan.service';


@Component({
  selector: 'app-edit-plan-modal',
  templateUrl: './edit-plan-modal.component.html',
  styleUrls: ['./edit-plan-modal.component.scss']
})
export class EditPlanModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() subpackageData: any = {};
  
  detailSubcription: boolean = false;
  tempQuantity: any = {};
  editFlags: any = {}; // Nueva propiedad

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<EditPlanModalComponent>,
    private planService: PlanService // Inyectar el servicio
  ) {}


  ngOnInit(): void {
    for (let data of this.subpackageData.attributes) {
      // Establecer en 0 si no hay cantidad
      if (data.pivot.quantity === null || data.pivot.quantity === undefined) {
        this.tempQuantity[data.id] = 0;
      } else {
        this.tempQuantity[data.id] = data.pivot.quantity;
      }
      this.editFlags[data.id] = false; // Inicializar el estado de edición
    }
  }
  
  
  
  saveData() {
    // Validar campos vacíos antes de guardar
    for (let data of this.subpackageData.attributes) {
      if (data.pivot.quantity !== undefined) {
        this.tempQuantity[data.id] = this.tempQuantity[data.id] || 0; // Establecer 0 si está vacío
        data.pivot.quantity = this.tempQuantity[data.id];
      } else {
        data.pivot.available = this.tempQuantity[data.id] || false; // Mantener valor por defecto
      }
    }
  
    // Llamar al servicio para guardar los datos
    this.planService.updatePlan(this.subpackageData.attributes).subscribe(response => {
      console.log('Datos guardados con éxito:', response);
    }, error => {
      console.log('Error al guardar los datos:', error);
    });
    /*
    this.planService.updatePlan(this.data.selectedPackage.attributes).subscribe(response => {
      console.log('Respuesta del servidor:', response);
    }, error => {
      console.log('Error:', error);
    });*/
    // Cerrar el modal
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
  
  
  
  
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  hasEmptyFields(): boolean {
    return Object.keys(this.tempQuantity).some(key => {
      const value = this.tempQuantity[key];
      return value === null || value === '' || value === undefined;
    });
  }

  validateEmptyField(id: any): void {
    if (this.tempQuantity[id] === '' || this.tempQuantity[id] === null || this.tempQuantity[id] === undefined || this.tempQuantity[id] < 0 ) {
      this.tempQuantity[id] = 0; // Reemplazar por 0 si está vacío o es menor que 0
    }
  }
  onToggleAvailable(data: any) {
    if (!data.pivot.available) {
      // Si se desmarca, también desmarcar y establecer a 0
      this.tempQuantity[data.id] = 0; // Poner a 0
      data.pivot.quantity = 0; // Asegúrate de que el pivot también se actualice
    }
  }
  
  
  

  
}
