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
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'variable-modal',
  templateUrl: 'variable-modal.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class VariableModalComponent {
  constructor(
    public dialogRef: MatDialogRef<VariableModalComponent>,
    private toastr: ToastrService,
    private service: AuthService,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}
  listaVariables: any;
  apiVariables = environment.API_URL_VARIABLES;

  onNoClick(): void {
    this.dialogRef.close();
  }
  borrarVariable(id: string) {
    console.log(this.apiVariables + id);
    this.service.deleteForm(this.apiVariables, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Variable borrada correctamente');
          this.GetAllVariables();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  GetAllVariables() {
    this.service.getForm(this.apiVariables).subscribe((res: any) => {
      console.log(res);
      this.httpService.stream_Variables(res);
    });
  }
}
