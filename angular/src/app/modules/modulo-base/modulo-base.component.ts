import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsApiService } from '../../generals-services/alerts-api.service';
//comentario
import { MustMatch } from '../../core/helpers/must-match.validator';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-modulo-base',
  templateUrl: './modulo-base.component.html',
  styleUrls: ['./modulo-base.component.scss']
})
export class ModuloBaseComponent implements OnInit {

  constructor(public ruta: Router, public msg: AlertsApiService, public translate: TranslateService, private formBuilder: UntypedFormBuilder ) { }

  ngOnInit(): void {
  }

}
