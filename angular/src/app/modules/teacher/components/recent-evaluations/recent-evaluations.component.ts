import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'recent-evaluations',
  templateUrl: './recent-evaluations.component.html',
  styleUrls: ['./recent-evaluations.component.scss']
})
export class RecentEvaluationsComponent implements OnInit {

  constructor() { }

  @Input() loading: boolean = true;
  @Input() evaluations: any;

  ngOnInit(): void {
  }

}
