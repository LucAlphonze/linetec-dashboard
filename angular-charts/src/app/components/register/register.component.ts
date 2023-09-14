import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {}

  registerform = this.builder.group({
    username: this.builder.control(
      '',
      Validators.compose([Validators.required, Validators.minLength(5)])
    ),
    name: this.builder.control('', Validators.required),
    password: this.builder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ])
    ),
    email: this.builder.control(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
    role: this.builder.control('64f1f60e918724a5f931d909'),
    isActive: this.builder.control(false),
  });

  proceedRegistration() {
    if (this.registerform.valid) {
      console.log(this.registerform.value);
      this.service.Proceedregister(this.registerform.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error.message);
          } else if (res.status == 200) {
            this.toastr.success(
              'Solicitar acceso con el administrador ',
              'Registro exitoso'
            );
            this.router.navigate(['login']);
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
}
