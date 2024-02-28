import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CSVDato } from 'src/app/models/datos.model';
import { HttpService } from 'src/app/service/http.service';
import { SpinnerService } from 'src/app/service/spinner.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent implements OnInit {
  constructor(
    private service: HttpService,
    private spinnerService: SpinnerService,
    private builder: FormBuilder
  ) {}
  exceedList: any = [];
  dataSource: any;
  listVariables: any = [];
  notExceedList: any = [];
  subscription!: Subscription;
  csv: any = '';
  valor: any;
  range: any = [];
  id_variable!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.getVariables();
    this.valor = this.builder.group({
      threshold: new FormControl<number>(25),
    });

    this.subscription = this.service.listaDatosInRange.subscribe((message) => {
      this.exceedList = message;

      // console.log('prueba filter: ', this.removeDuplicates(this.exceedList));
      this.dataSource = new MatTableDataSource(this.exceedList);
      if (this.exceedList.length != 0) {
        this.spinnerService.detenerSpinner('tabla');
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.subscription = this.service.rangeInfo.subscribe((message) => {
      this.range = message;
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

  getInRangeTabla(id_variable: string) {
    this.spinnerService.llamarSpinner('tabla');
    var inicio: any = this.range[0];
    var final: any = this.range[1];
    this.service.getAllInRange(id_variable, inicio, final).subscribe((data) => {
      this.exceedList = data['datos'].filter((x: any) => {
        return x.valor_lectura > this.valor.value.threshold;
      });
      this.notExceedList = data['datos'].filter((n: any) => {
        return n.valor_lectura < this.valor.value.threshold;
      });
      var notDuplicatedExceedList = this.removeDuplicates(this.exceedList);
      var notDuplicatedNotExceedList = this.removeDuplicates(
        this.notExceedList
      );
      console.log(
        'exceed: ',
        notDuplicatedExceedList,
        'not exceed: ',
        notDuplicatedNotExceedList
      );
      if (data['datos'].length == 0) {
        this.spinnerService.detenerSpinner('tabla');
        this.service.stream_DatosInRange([]);
      }
      this.spinnerService.detenerSpinner('tabla');
      var result = this.notExceedListPusher(
        notDuplicatedNotExceedList,
        notDuplicatedExceedList
      );
      this.enviarDatos(result[0], result[1]);
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
  formatDate(data: string) {
    const date = new Date(data);
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  getVariables() {
    this.service.getVariables().subscribe((data) => {
      this.service.stream_Variables(data);
      this.listVariables = data;
      console.log(this.listVariables);
      this.id_variable = this.listVariables[0]._id;
    });
  }
  variableSelected(value: Event) {
    this.id_variable = (value.target as HTMLSelectElement).value;
    console.log('valor variable:', this.id_variable);
  }
  enviarDatos(notExceedList: any, ExceedList: any) {
    console.log(
      'exceed: ',
      ExceedList.length,
      'not exceed: ',
      notExceedList.length
    );
    ExceedList.map((e: any, index: number) => {
      e.time = this.formatTime(
        new Date(
          notExceedList[
            index < notExceedList.length ? index : notExceedList.length - 1
          ].time_stamp
        ).getTime(),
        new Date(e.time_stamp).getTime()
      );
      e.cTime_stamp = this.formatDate(
        notExceedList[
          index < notExceedList.length ? index : notExceedList.length - 1
        ].time_stamp
      );
      e.time_stamp = this.formatDate(e.time_stamp);
    });
    this.service.stream_DatosInRange(ExceedList);
  }

  notExceedListPusher(notDuplicatedNotExceedList: any, exceedList: any) {
    const notExceedList = [];
    const ExceedList = [];
    const resultado: any = [];
    let j = 0;

    //no funciona bien si el not exceeded list es mas grande hay que arreglarlo

    for (let i = 0; i < exceedList.length; ) {
      // console.log('i es: ', i);
      if (
        new Date(notDuplicatedNotExceedList[j].time_stamp).getTime() >
        new Date(exceedList[i].time_stamp).getTime()
      ) {
        // console.log(
        //   'exceed: ',
        //   exceedList[i],
        //   'not exceed: ',
        //   notDuplicatedNotExceedList[j]
        // );
        notExceedList.push(notDuplicatedNotExceedList[j]);
        ExceedList.push(exceedList[i]);
        i++;
      }
      if (
        j == notDuplicatedNotExceedList.length - 1 ||
        i == exceedList.length - 1
      ) {
        resultado.push(notExceedList);
        resultado.push(ExceedList);
        return resultado;
      } else if (
        new Date(notDuplicatedNotExceedList[j].time_stamp).getTime() <
        new Date(exceedList[i].time_stamp).getTime()
      ) {
        // console.log(
        //   'exceed time stamp: ',
        //   exceedList[i].time_stamp,
        //   'not exceed time stamp: ',
        //   notDuplicatedNotExceedList[j].time_stamp
        // );
        j++;
        // console.log('j es: ', j);
      }
    }

    return resultado;
  }
}
