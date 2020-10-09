import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayCreditPaymentComponent } from './pay-credit-payment.component';

describe('PayCreditPaymentComponent', () => {
  let component: PayCreditPaymentComponent;
  let fixture: ComponentFixture<PayCreditPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayCreditPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayCreditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
