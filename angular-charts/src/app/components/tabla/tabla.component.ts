import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CSVDato } from 'src/app/models/datos.model';
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
  csv: any = '';

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
  downloadCSV() {
    let csvList: CSVDato[];
    csvList = this.removeDuplicates(this.exceedList).map((e: any) => ({
      valor_lectura: e.valor_lectura,
      tiempo_inicio: e.time_stamp,
      tiempo_fin: e.cTime_stamp,
      diferencia: e.time,
    }));

    for (let row = 0; row < csvList.length; row++) {
      let keysAmount = Object.keys(csvList[row]).length;
      let keysCounter = 0;

      // If this is the first row, generate the headings
      if (row === 0) {
        // Loop each property of the object
        for (let key in csvList[row]) {
          // This is to not add a comma at the last cell
          // The '\n' adds a new line
          this.csv += key + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
          keysCounter++;
        }
      } else {
        for (let key in csvList[row]) {
          this.csv +=
            csvList[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
          keysCounter++;
        }
      }

      keysCounter = 0;
    }
    console.log('csv: ', this.csv);
    let link = document.createElement('a');
    link.id = 'download-csv';
    link.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(this.csv)
    );
    link.setAttribute('download', 'alertas_data.csv');
    document.body.appendChild(link);
    link.click();
  }

  displayedColumns: string[] = [
    'exceed_value',
    'tiempo_inicio',
    'tiempo_fin',
    'diferencia',
  ];
}
