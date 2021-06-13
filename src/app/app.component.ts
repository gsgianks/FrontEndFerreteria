import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ferr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ferreteria';

  DisplayLogin = false;
  year: number = new Date().getFullYear();

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
