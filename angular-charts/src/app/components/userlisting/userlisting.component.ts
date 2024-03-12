import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.css'],
})
export class UserlistingComponent implements OnInit {
  constructor(private service: AuthService, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.LoadUser();
  }
  userList: any;
  dataSource: any;
  editable: boolean = false;
  ulist: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  LoadUser() {
    this.service.GetAll().subscribe((res) => {
      this.userList = res;
      console.log('userlist: ', this.userList);
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  displayedColumns: string[] = ['username', 'name', 'email', 'role', 'status'];

  editableToggle() {
    this.editable = !this.editable;
  }

  guardarCambios(data: any) {
    var dataToUpdate: any = [];
    var ulist: any = [];
    console.log('user List: ', this.ulist);
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
          ulist[i].role._id != data[i].role._id
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
}
