import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { VariableModalComponent } from 'src/app/forms/variable-form/variable.modal.component';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  checkNumber,
  checkSpecial,
  checkUpperCase,
} from 'src/app/service/validator';
@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.css'],
})
export class UserlistingComponent implements OnInit {
  constructor(
    private service: AuthService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.LoadUser();
  }
  pass: string = 'password';
  show = false;
  userList: any = [];
  dataSource: any;
  editable: boolean = false;
  userUrl = environment.API_URL_USERS;
  subscription!: Subscription;
  userForm!: FormGroup;
  fields: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  LoadUser() {
    this.service.GetAll().subscribe((res) => {
      this.service.streamUsers(res);
    });
    this.subscription = this.service.listUser.subscribe((message: any) => {
      Array.from(message).forEach((element: any) => {
        element.show = false;
        element.pass = 'password';
      });

      this.userList = message;
      console.log('userlist: ', this.userList);
      this.buildForm();
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.service.getUser();
  }

  displayedColumns: string[] = [
    'username',
    'name',
    'email',
    'role',
    'password',
    'status',
    'action',
    'address ',
  ];

  editableToggle() {
    this.editable = !this.editable;
  }

  guardarCambios(data: any) {
    var ulist: any = [];

    this.service.GetAll().subscribe((res) => {
      ulist = res;
      for (let i = 0; i < ulist.length; i++) {
        console.log(data[i]);
        console.log(this.userForm.controls[ulist[i].name].value);
        data[i].password = this.userForm.controls[ulist[i].name].value;
        if (
          ulist[i].isActive != data[i].isActive ||
          ulist[i].role._id != data[i].role._id ||
          ulist[i].password != data[i].password
        ) {
          console.log(data[i]);
          this.service
            .UpdateUser(data[i].username, data[i])
            .subscribe((res) => {
              console.log(res);
              this.toastr.success('¡Cambios Guardados con exito!', '', {
                toastClass: 'yourclass ngx-toastr',
                positionClass: 'toast-bottom-center',
              });
            });
        }
        if (i == this.userList.length - 1) {
          return;
        }
      }
    });
  }

  openDialog(variable_id: string): void {
    const dialogRef = this.dialog.open(VariableModalComponent, {
      data: {
        variable_id: variable_id,
        titulo: 'este usuario',
      },
    });
  }
  showPass(element: any): void {
    if (element.pass === 'password') {
      element.show = true;
      element.pass = '';
    } else {
      element.show = false;
      element.pass = 'password';
    }
  }
  get password() {
    if (this.editable === true) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }

    return this.userForm;
  }

  getFormControlsFields() {
    const formGroupFields: any = {};
    for (const user of this.userList) {
      formGroupFields[user.name] = new FormControl(user.password, [
        Validators.required,
        Validators.minLength(8),
        checkUpperCase(),
        checkNumber(),
        checkSpecial(),
      ]);
      this.fields.push(user);
    }
    return formGroupFields;
  }
  buildForm() {
    const formGroupFields = this.getFormControlsFields();
    (this.userForm = new FormGroup(formGroupFields)),
      [
        Validators.required,
        Validators.minLength(8),
        checkUpperCase(),
        checkNumber(),
        checkSpecial(),
      ];
    console.log('form group fields', formGroupFields);
    console.log('userform', this.userForm.controls);
  }
}
