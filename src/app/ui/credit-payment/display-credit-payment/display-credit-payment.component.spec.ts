import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCreditPaymentComponent } from './display-credit-payment.component';

describe('DisplayCreditPaymentComponent', () => {
  let component: DisplayCreditPaymentComponent;
  let fixture: ComponentFixture<DisplayCreditPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayCreditPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayCreditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
