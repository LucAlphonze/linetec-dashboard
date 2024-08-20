import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { VariableModalComponent } from 'src/app/forms/variable-form/variable.modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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

    this.userForm = this.builder.group({
      password: [
        '',
        [
          Validators.minLength(8),
          checkUpperCase(),
          checkNumber(),
          checkSpecial(),
        ],
      ],
    });
  }
  userForm: any;

  pass: string = 'password';
  show = false;
  userList: any = [];
  dataSource: any;
  editable: boolean = false;
  userUrl = environment.API_URL_USERS;
  subscription!: Subscription;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  LoadUser() {
    this.service.GetAll().subscribe((res) => {
      this.service.streamUsers(res);
    });
    this.subscription = this.service.listUser.subscribe((message) => {
      this.userList = message;
      this.userList.forEach((element: any) => {
        element.show = false;
        element.pass = 'password';
      });
      console.log('userlist: ', this.userList);
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
  ];

  editableToggle() {
    this.editable = !this.editable;
  }

  guardarCambios(data: any) {
    var ulist: any = [];
    this.service.GetAll().subscribe((res) => {
      ulist = res;
      for (let i = 0; i < ulist.length; i++) {
        console.log(
          'user List: ',
          ulist[i].isActive,
          'updated data: ',
          data[i].isActive,
          'i es : ',
          i
        );
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
    if (this.editable == true) {
      this.userForm.get('password').enable();
    } else {
      this.userForm.get('password').disable();
    }
    return this.userForm.get('password');
  }
}
