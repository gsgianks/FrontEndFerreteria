import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/domain/User';

@Component({
  selector: 'ferr-view-credit-payment',
  templateUrl: './view-credit-payment.component.html',
  styleUrls: ['./view-credit-payment.component.scss']
})
export class ViewCreditPaymentComponent implements OnInit {

  idUser: number = null;
  idPago: number = null;
  user: User = null;
  selectedTab = 0;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.idUser = +this.route.snapshot.paramMap.get('id');
    this.idPago = +this.route.snapshot.paramMap.get('idPago');
    const tab = this.route.snapshot.paramMap.get('tab');

    if (tab === 'his') {
      this.selectedTab = 1;
    }
  }

}
