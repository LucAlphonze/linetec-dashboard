import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from './service/auth.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService
  ) {}
  rtoken_url = environment.API_URL_RTOKEN;
  rBody = {
    token: sessionStorage.getItem('rtoken')?.toString(),
    user: sessionStorage.getItem('username')?.toString(),
  };
  resData: any;
  timeout: any;
  token: any;
  onNoClick(): void {
    this.dialogRef.close();
  }
  refreshToken(): void {
    this.authService.postForm(this.rtoken_url, this.rBody).subscribe((res) => {
      this.resData = res.body;
      console.log(
        'refresh token: ',
        this.rBody,
        'access Token: ',
        this.resData
      );
      console.log('status code: ', res.status);
      this.token = this.resData.accessToken;
      sessionStorage.setItem('token', this.resData.accessToken);
      this.timeout =
        this.jwtHelper.getTokenExpirationDate(this.token)!.valueOf() -
        new Date().valueOf();
      this.authService.expirationCounter(this.timeout);
      if (res.status == 200) {
        this.toastr.success('sesion extendida');
      }
    });
  }
}
