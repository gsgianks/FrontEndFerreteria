import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { WhiteSpaceValidator } from 'src/app/shared/validators/whiteSpaceValidator';

@Component({
  selector: 'ferr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginError = '';
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.logout();
    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      correoElectronico: ['', [Validators.required, WhiteSpaceValidator.cannotContainSpace]],
      contrasena: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60), WhiteSpaceValidator.cannotContainSpace ]]
    });
  }

  login(submittedForm: FormGroup) {
    this.authService.login(submittedForm.value.correoElectronico, submittedForm.value.contrasena).
    subscribe(authResponse => {
      this.router.navigate(['/home']);
    }, error => {this.loginError = 'Datos no válidos'; });
  }


}
