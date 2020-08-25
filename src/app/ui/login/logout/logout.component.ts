import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'mot-logout',
  template: `
  <p>
  Logging out...
  </p>
  `,
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
