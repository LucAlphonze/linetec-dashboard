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
    this.service.GetById(this.loginForm.value.username).subscribe((res) => {
      this.userData = res;
      console.log(this.userData);
      if (this.userData.password === this.loginForm.value.password) {
        if (this.userData.isActive) {
          sessionStorage.setItem('username', this.userData.username);
          sessionStorage.setItem('userrole', this.userData.role.name);
          this.router.navigate(['']);
          this.toastr.success('acceso concedido');
          console.log(sessionStorage.getItem('userrole')?.toString());
        } else {
          this.toastr.error('Contactar con administrador', 'usuario inactivo');
        }
      } else {
        this.toastr.error('Credenciales invalidas', 'contraseña incorrecta');
      }
    });
  }
}
