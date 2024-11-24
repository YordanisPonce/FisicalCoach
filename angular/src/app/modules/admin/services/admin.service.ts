import { Injectable, OnInit, } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor() { }

  isAdmin():boolean {
    return true
  }

  
}
