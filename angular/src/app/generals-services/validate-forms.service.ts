import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateFormsService {

  validarNumbers(e: any) {

    let key = window.event ? e.which : e.keyCode;
    console.log(key)
    if ((key < 48 || key > 57))
    {
      e.preventDefault();
    }
  }
  validarPhone(elemento: any) {

    let texto = elemento.key
    console.log(elemento)
    console.log(texto)
    let regex = /^\+\d{2,3}\s\d{10}$/;

    if (!regex.test(texto))
    {
      if (document.getElementById("phone"))
      {

      }

      return false
    } else
    {
      if (document.getElementById("phone"))
      {

      }


      return true
    }
  }
}
