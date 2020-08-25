import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'mot-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'taller-motos';

  DisplayLogin = false;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.authService.authStatus.subscribe(
      authStatus => {
        const jwt = this.authService.getToken();
        setTimeout(() => (this.DisplayLogin = !(jwt === null || jwt === ''), 0));
      }
    );
  }

  get displayMenu() {
    return this.DisplayLogin;
  }

}
