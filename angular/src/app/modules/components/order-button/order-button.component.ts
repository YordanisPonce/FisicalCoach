import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order-button',
  templateUrl: './order-button.component.html',
  styleUrls: ['./order-button.component.scss'],
})
export class OrderButtonComponent implements OnInit {
  @Input() list: any[] = [];
  @Output() convertedList = new EventEmitter();

  orderOptions: any[] = [
    { icon: 'pi pi-arrow-up', tooltip: 'asc', justify: 'center' },
    { icon: 'pi pi-arrow-down', tooltip: 'desc', justify: 'center' },
  ];
  orderBy: any = { icon: 'pi pi-arrow-up', tooltip: 'desc', justify: 'center' };

  constructor() {}

  ngOnInit(): void {}
}
