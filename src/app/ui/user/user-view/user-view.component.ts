import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/domain/User';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'mot-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {

  model: User = null;
  id: number = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    // this.route.params.subscribe({
    //   next: (params: Params) => {
    //     // tslint:disable-next-line: no-string-literal
    //     const id = +params['id'];
    //     if (this.id !== id && id) {
    //       this.userService.getById(id).subscribe(res => {
    //         if (res.code === 0) {
    //           this.model = res.items[0];
    //         } else {
    //           // alerti
    //           // Agregar alertify del error
    //         }
    //       });
    //       this.id = id;
    //     }
    //   }
    // });
  }

  // selectModel(selectedModel: User, toEdit = false): void {

  //   if (toEdit) {
  //     this.router.navigate(['/user', 'edit', selectedModel.id]);
  //   } else {
  //     this.router.navigate(['/user', selectedModel.id]);
  //   }
  // }

  // onCancelEdit(): void {
  //   this.router.navigate(['/user']);
  // }
}
