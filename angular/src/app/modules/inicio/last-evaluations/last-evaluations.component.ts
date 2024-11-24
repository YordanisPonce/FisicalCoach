import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-last-evaluations',
  templateUrl: './last-evaluations.component.html',
  styleUrls: ['./last-evaluations.component.scss'],
})
export class LastEvaluationsComponent implements OnInit {
  @Input() loading: boolean = true;
  @Input() evaluations: any;

  ngOnInit(): void {
    console.log('hola');
  }
}
