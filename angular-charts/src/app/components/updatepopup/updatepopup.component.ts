import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css'],
})
export class UpdatepopupComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialogRef<UpdatepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  editData: any;

  ngOnInit(): void {
    this.service.GetAllRoles().subscribe((res) => {
      console.log('roles', res);
      this.rolelist = res;
    });
    if (this.data.username != null && this.data.username != '') {
      this.service.GetById(this.data.username).subscribe((res) => {
        this.editData = res;
        this.registerform.setValue({
          username: this.editData.username,
          name: this.editData.name,
          password: this.editData.password,
          email: this.editData.email,
          role: this.editData.role,
          isActive: this.editData.isActive,
        });
      });
    }
  }

  rolelist: any;
  registerform = this.builder.group({
    username: this.builder.control(''),
    name: this.builder.control(''),
    password: this.builder.control(''),
    email: this.builder.control(''),
    role: this.builder.control('', Validators.required),
    isActive: this.builder.control(false),
  });

  updateUser() {
    if (this.registerform.valid) {
      this.service
        .UpdateUser(this.registerform.value.username, this.registerform.value)
        .subscribe((res) => {
          this.toastr.success('Updated successfully');
          this.dialog.close();
        });
    } else {
      this.toastr.warning('Please select a role');
    }
  }
}
