import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent {
  constructor(public dialogRef: MatDialogRef<LoginModalComponent>) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
