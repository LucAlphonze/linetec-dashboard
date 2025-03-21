import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ChartGeneratorService } from 'src/app/service/chart-generator.service';
import { HttpService } from 'src/app/service/http.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  subscription!: Subscription;
  chartList: any = [];
  interval: any = [];
  range!: any;
  rangeSub!: any;
  listVariables: any;
  valor: any;
  chartUrl: string = environment.API_URL_CHARTS;
  isAdminUser: boolean = false;
  selectTime2: any = [
    {
      option: '1h',
      value: 3600000,
      binSize: 1,
      unit: 'second',
    },
    {
      option: '3h',
      value: 10800000,
      binSize: 10,
      unit: 'second',
    },
    {
      option: '12h',
      value: 43200000,
      binSize: 5,
      unit: 'minute',
    },
    {
      option: '1d',
      value: 86400000,
      binSize: 15,
      unit: 'minute',
    },
    {
      option: '3d',
      value: 259200000,
      binSize: 1,
      unit: 'hour',
    },
    {
      option: '1w',
      value: 604800000,
      binSize: 6,
      unit: 'hour',
    },
    {
      option: '1m',
      binSize: 1,
      unit: 'day',
      value: 2419200000,
    },
  ];

  @Input() value: any;
  @Input() selectValue: any;
  @Input() selectTime: any;
  @Input() indice: any;
  @Input() tabla: any;

  constructor(
    private _httpService: HttpService,
    private spinnerService: SpinnerService,
    private builder: FormBuilder,
    private chartService: ChartGeneratorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserRole();
    this.range = this.builder.group({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      granularidad: new FormControl<string>('day'),
    });

    this.interval = this.builder.group({
      medida: new FormControl<String | null>('max'),
      threshold: new FormControl<number>(25),
    });
    if (this.tabla) {
      this.getVariables();
    }
    this.subscription = this.chartService.listaDeCharts.subscribe((data) => {
      this.chartList = data;
      console.log('toolbar chartList', this.chartList);
      for (let i = 0; i < this.chartList.length; i++) {
        this.setSelectTimeInterval(
          {
            option: '1h',
            value: 3600000,
            binSize: 1,
            unit: 'second',
          },
          i
        );
      }
    });
    this.subscription = this.chartService.rangeInfo.subscribe(
      (message: any) => {
        this.rangeSub = message;
      }
    );
  }

  setValue(value: any, i: number) {
    console.log('value toolbar:', value, 'indice: ', i);
  }
  setSelectValue(sValue: any, i: number) {
    this.chartList[i].sValue = sValue;
    var data = this.chartList[i];
    data.value = sValue;
    data.index = i;

    this.chartService.streamChartIntervalInfo(data);
    console.log('select value: ', this.chartList[i], 'indice: ', i);
  }
  setSelectTimeInterval(sTime: any, i: number, tabla?: any) {
    this.chartList[i].inicio = null;
    this.chartList[i].final = null;
    tabla
      ? (tabla.sTime = sTime.value)
      : (this.chartList[i].sTime = sTime.value);
    tabla ? (tabla.sInterval = sTime) : (this.chartList[i].sInterval = sTime);

    console.log(
      'select time: ',
      tabla ? tabla : this.chartList[i],
      'indice: ',
      i
    );
  }

  setInicioFinal(i: number, tabla?: any) {
    tabla
      ? (tabla.inicio = this.range.value.start._d?.getTime().toString())
      : (this.chartList[i].inicio = this.range.value.start._d
          ?.getTime()
          .toString());
    tabla
      ? (tabla.final = this.range.value.end._d?.getTime().toString())
      : (this.chartList[i].final = this.range.value.end._d
          ?.getTime()
          .toString());

    console.log(
      'inicio: ',
      tabla ? tabla.inicio : this.chartList[i].inicio,
      'final ',
      tabla ? tabla.final : this.chartList[i].final,
      'indice: ',
      i
    );
    var difference =
      parseInt(tabla ? tabla.final : this.chartList[i].final) -
      parseInt(tabla ? tabla.inicio : this.chartList[i].inicio);
    if (difference < this.selectTime[4].value) {
      tabla
        ? (tabla.sTime = this.selectTime2[3].value)
        : (this.chartList[i].sTime = this.selectTime2[3].value);
      tabla
        ? (tabla.sInterval = this.selectTime2[3])
        : (this.chartList[i].sInterval = this.selectTime2[3]);
    } else if (difference < this.selectTime[5].value) {
      tabla
        ? (tabla.sTime = this.selectTime2[4].value)
        : (this.chartList[i].sTime = this.selectTime2[4].value);
      tabla
        ? (tabla.sInterval = this.selectTime2[4])
        : (this.chartList[i].sInterval = this.selectTime2[4]);
    } else if (difference < this.selectTime[5].value * 3) {
      tabla
        ? (tabla.sTime = this.selectTime2[5].value)
        : (this.chartList[i].sTime = this.selectTime2[5].value);
      tabla
        ? (tabla.sInterval = this.selectTime2[5])
        : (this.chartList[i].sInterval = this.selectTime2[5]);
    } else {
      tabla
        ? (tabla.sTime = this.selectTime2[6].value)
        : (this.chartList[i].sTime = this.selectTime2[6].value);
      tabla
        ? (tabla.sInterval = this.selectTime2[6])
        : (this.chartList[i].sInterval = this.selectTime2[6]);
    }
  }

  getValuesByInterval(i: number, tabla?: any) {
    if (tabla) {
      this._httpService.set_Inicio_Final(tabla.inicio, tabla.final);
      return console.log(
        `tabla: ${JSON.stringify(tabla)}, inicio: ${tabla.inicio}, final: ${
          tabla.final
        }`
      );
    }
    const currentDateObj = new Date();
    const final = this.chartList[i].final
      ? this.chartList[i].final
      : currentDateObj.getTime();
    const millis = this.chartList[i].sTime;
    const inicio = this.chartList[i].final
      ? this.chartList[i].inicio
      : final - millis;
    console.log('inicio: ', inicio, 'final: ', final);

    this.spinnerService.llamarSpinner(`grafico${i}`);
    this._httpService
      .getInterval(
        inicio,
        final,
        this.chartList[i].sInterval.unit,
        this.chartList[i].sInterval.binSize
      )
      .pipe(
        catchError(async (error) => {
          console.log(error.message);
          return error;
        })
      )
      .subscribe((data) => {
        data.index = i;
        data.value = this.interval.value.medida;
        const datosFilter = data.datos.filter((e: any) => {
          return e._id == this.chartList[i].variable;
        });
        data.datos = datosFilter;
        console.log(
          'filter data: ',
          data,
          'medida: ',
          this.interval.value.medida
        );
        this.chartList[i].datos = data.datos;
        this.chartService.streamChartIntervalInfo(data);
        this.spinnerService.detenerSpinner(`grafico${i}`);
      });
  }

  getVariables() {
    this._httpService.getVariables().subscribe((data) => {
      this.listVariables = data;
      this.tabla.id_variable = this.listVariables[0]._id;
      this.tabla.threshold = this.interval.value.threshold;
      console.log('tabla', this.tabla);
    });
  }

  variableSelected(variable: any) {
    this.tabla.id_variable = variable;
    console.log('variable selected: ', this.tabla);
  }

  setThreshold() {
    console.log('threshold', this.interval.value.threshold);
    this.tabla.threshold = this.interval.value.threshold;
  }
  getUserRole() {
    const userRole = this.authService.getUserRole();
    if (userRole === 'admin') {
      this.isAdminUser = true;
    } else {
      this.isAdminUser = false;
    }
  }
  removeCharts(chart: any) {
    this.chartService.removerCharts(this.chartUrl, chart.nombre, chart._id);
  }
}
