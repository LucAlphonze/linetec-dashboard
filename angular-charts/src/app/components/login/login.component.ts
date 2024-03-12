import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {
  checkNumber,
  checkSpecial,
  checkUpperCase,
} from 'src/app/service/validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  registerForm: any;
  pass: string = '';
  show = false;
  mobile = false;

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    sessionStorage.clear();
  }

  ngOnInit(): void {
    this.pass = 'password';
    if (window.screen.width < 500) {
      this.mobile = true;
    }
    this.registerForm = this.builder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          checkUpperCase(),
          checkNumber(),
          checkSpecial(),
        ],
      ],
      email: new FormControl('', [Validators.required, Validators.email]),
      role: this.builder.control('64f1f60e918724a5f931d909'),
      isActive: this.builder.control('inactive'),
    });
  }

  showDiv = {
    Login: true,
    Register: false,
  };

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
          if (this.userData['datos'].isActive === 'active') {
            this.toastr.success('acceso concedido', '', {
              toastClass: 'yourclass ngx-toastr',
              positionClass: 'toast-bottom-center',
            });
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
          this.service.openDialog2();
          break;

        default:
          this.service.openDialog2();
          break;
      }
    });
  }

  proceedRegistration() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.service.Proceedregister(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error.message);
          } else if (res.status == 200) {
            this.toastr.success(
              'Solicitar acceso con el administrador ',
              'Registro exitoso'
            );
            this.mostrarLogin();
          }
        },
        error: (error) => {
          this.toastr.warning('error', error);
          console.log(error);
        },
      });
    } else {
      this.toastr.warning('Por favor entre datos validos');
    }
  }

  mostrarLogin() {
    this.showDiv.Login = true;
    this.showDiv.Register = false;
    this.show = false;
    this.pass = 'password';
  }
  mostrarRegistro() {
    this.showDiv.Register = true;
    this.showDiv.Login = false;
    this.show = false;
    this.pass = 'password';
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  showPass() {
    if (this.pass === 'password') {
      this.pass = 'text';
      this.show = true;
    } else {
      this.pass = 'password';
      this.show = false;
    }
  }
}
