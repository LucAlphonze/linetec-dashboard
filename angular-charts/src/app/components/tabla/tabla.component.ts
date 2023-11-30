import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent implements OnInit {
  constructor(private service: HttpService) {}
  exceedList: any = [];
  dataSource: any;
  listVariables: any = [];
  subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.subscription = this.service.listaDatosInRange.subscribe((message) => {
      this.exceedList = message;

      // console.log('prueba filter: ', this.removeDuplicates(this.exceedList));

      this.dataSource = new MatTableDataSource(
        this.removeDuplicates(this.exceedList)
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  formatTime(notExceed: number, exceed: number) {
    var seconds = (notExceed - exceed) / 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}H ${formattedMinutes}M ${formattedSeconds}S`;
  }
  removeDuplicates(data: any) {
    const ids = data.map(
      ({ cTime_stamp }: { cTime_stamp: any }) => cTime_stamp
    );
    const filtered = data.filter(
      ({ cTime_stamp }: { cTime_stamp: any }, index: number) =>
        ids.includes(cTime_stamp, index + 1)
    );

    return filtered;
  }

  displayedColumns: string[] = [
    'exceed_value',
    'timestamp',
    'NE_Time_Stamp',
    'exceed_time',
  ];
}
