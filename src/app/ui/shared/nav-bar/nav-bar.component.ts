import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ferr-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  userName = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authStatus.subscribe(
      authStatus => {
        const user = this.authService.getName();
        setTimeout(() => (this.userName = user));
      }
    );
  }

}
