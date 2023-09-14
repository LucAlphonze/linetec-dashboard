import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    sessionStorage.clear();
  }

  loginForm = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
  });
  userData: any;

  proceedLogin() {
    this.service.LogIn(this.loginForm.value).subscribe((res) => {
      this.userData = res;
      console.log(this.userData.status);
      console.log(this.userData);
      switch (this.userData.status) {
        case 200:
          if (this.userData['datos'].isActive) {
            // sessionStorage.setItem('token', this.userData.token);
            // sessionStorage.setItem('username', this.userData['datos'].username);
            // sessionStorage.setItem(
            //   'userrole',
            //   this.userData['datos'].role.name
            // );
            // console.log(sessionStorage.getItem('userrole')?.toString());
            this.toastr.success('acceso concedido');
            this.service.storeUserData(
              this.userData.token,
              this.userData['datos'],
              this.userData.rtoken
            );
          } else {
            this.toastr.error(
              'Contactar con administrador',
              'usuario inactivo'
            );
          }
          break;
        case 403:
          this.toastr.error(
            'Credenciales invalidas',
            'usuario o contraseña incorrecta'
          );
          break;

        default:
          this.toastr.error(
            'Credenciales invalidas',
            'usuario o contraseña incorrecta'
          );
          break;
      }
    });
  }
}

// if (
//   this.userData['datos'].username === this.loginForm.value.username &&
//   this.userData['datos'].password === this.loginForm.value.password
// ) {
//   if (this.userData['datos'].isActive) {
//     sessionStorage.setItem('token', this.userData.token);
//     sessionStorage.setItem('username', this.userData['datos'].username);
//     sessionStorage.setItem('userrole', this.userData['datos'].role.name);
//     this.router.navigate(['']);
//     this.toastr.success('acceso concedido');
//     console.log(sessionStorage.getItem('userrole')?.toString());
//   } else {
//     this.toastr.error('Contactar con administrador', 'usuario inactivo');
//   }
// } else if (this.userData.status == 403) {
//   console.log('else if');
//   this.toastr.error(
//     'Credenciales invalidas',
//     'usuario o contraseña incorrecta'
//   );
// }
