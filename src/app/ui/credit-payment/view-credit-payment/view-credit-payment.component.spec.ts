import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreditPaymentComponent } from './view-credit-payment.component';

describe('ViewCreditPaymentComponent', () => {
  let component: ViewCreditPaymentComponent;
  let fixture: ComponentFixture<ViewCreditPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCreditPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCreditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
