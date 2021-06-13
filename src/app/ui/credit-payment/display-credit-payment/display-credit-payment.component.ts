import { Component, Input, OnInit } from '@angular/core';
import { CreditPayment } from 'src/app/domain/Credit-Payment';

@Component({
  selector: 'ferr-display-credit-payment',
  templateUrl: './display-credit-payment.component.html',
  styleUrls: ['./display-credit-payment.component.scss']
})
export class DisplayCreditPaymentComponent implements OnInit {
  @Input() payment: CreditPayment;
  constructor() { }

  ngOnInit() {
  }

}
