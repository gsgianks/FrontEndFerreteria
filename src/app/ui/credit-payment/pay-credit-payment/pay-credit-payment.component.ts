import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CreditPayment } from 'src/app/domain/Credit-Payment';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { CreditTableComponent } from '../../credit/credit-table/credit-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmationDialogService } from '../../shared/confirmation-dialog/confirmation-dialog.service';
import { FormUtils } from '../../shared/formUtils';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/common/Constants';
import * as alertify from 'alertifyjs';
import { Credit } from 'src/app/domain/Credit';

const FIELD_REQUIRED = 'Campo Requerido.';

@Component({
  selector: 'ferr-pay-credit-payment',
  templateUrl: './pay-credit-payment.component.html',
  styleUrls: ['./pay-credit-payment.component.scss']
})
export class PayCreditPaymentComponent implements OnInit {

  @ViewChild(CreditTableComponent, {static: false}) child: CreditTableComponent;

  form: FormGroup;
  model: CreditPayment = null;
  modelCredit: Credit = null;
  updating = false;
  estado = Constants.Pendiente; // Estado para cargar los créditos
  @Input() idUser: number;

  private ngUnsubscribe: Subject<boolean> = new Subject();

  messages: any = {};
  formMessages: any = {
    id_Usuario: {
      required: FIELD_REQUIRED
    },
    abono: {
      required: FIELD_REQUIRED
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: BaseService<CreditPayment>,
    private serviceCredit: BaseService<Credit>,
    private fb: FormBuilder
  ) {
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [''],
      id_Usuario: ['', [Validators.required]],
      monto: [null],
      abono: [null, [Validators.required]],
      saldo: [0],
    });

    const fieldsToWatch = [
      'id_Usuario',
      'monto',
      'abono',
      'saldo'
    ];
    if (this.model) {
      FormUtils.toFormGroup(this.form, this.model);
      this.form.controls.id_Usuario.setValue(this.idUser);
    }
    fieldsToWatch.forEach(x => this.addFieldWatch(this.form.get(x), this.messages, this.formMessages, x));
  }

  addFieldWatch(ctrl: AbstractControl, errorMessages: any, defaultMessages: any, name: string): void {
    ctrl.valueChanges
      // the operator takeUntil will keep alive the subscription until the Subject tells
      // them to complete (see ngOnDestroy below)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.setMessage(ctrl, errorMessages, defaultMessages, name));
  }

  setMessage(ctrl: AbstractControl, errorMessages: any, defaultMessages: any, name: string): void {
    errorMessages[name] = '';
    if ((ctrl.touched || ctrl.dirty) && ctrl.errors) {
      errorMessages[name] = Object.keys(ctrl.errors)
        .map(key => defaultMessages[name][key])
        .join(' ');
    }
  }

  ngOnInit() {

    this.idUser = +this.route.snapshot.paramMap.get('id');
    this.model = { id: 0 } as CreditPayment;
    this.createForm();

    // Obtener el usuario
    this.serviceCredit.getById(Constants.Credit + '/CreditoUsuario', this.idUser).subscribe(res => {
      if (res.codigo === 0) {
        this.modelCredit = res.items[0];
        this.form.controls.monto.setValue(this.modelCredit.saldo);
      } else {
        alertify.error(res.descripcion);
      }
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submit() {

    if (!this.form.valid) {
      alertify.error('Formulario inválido');
    } else {
      FormUtils.toModel(this.form, this.model);
      this.saveModel();
    }
    return false;
  }

  saveModel(): void {
    this.service.post(Constants.CreditPayment + '/PagoCredito', this.model)
      .subscribe(res => {
        if (res.codigo === 0) {
          this.createForm();
          alertify.success(res.descripcion);
          this.child.getAll();
        } else if (res.codigo === 1) {
          alertify.success(res.descripcion);
          alertify.alert('El vuelto es de:', res.datoExtra, function(){});
        }else {
          alertify.error(res.descripcion);
        }
      });
  }

  goToList(): void {
    this.router.navigate(['./credit']);
  }

  changePay() {
    var diferencia = this.modelCredit.saldo - this.form.value['abono'];
    this.form.controls.saldo.setValue(diferencia < 0?0:diferencia);
    
  }

}
