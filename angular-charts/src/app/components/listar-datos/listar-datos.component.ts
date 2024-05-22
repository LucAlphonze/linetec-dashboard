import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { Chart, registerables } from 'node_modules/chart.js';
import 'chartjs-adapter-date-fns';
import 'date-fns/locale';
import { AuthService } from 'src/app/service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilsService } from 'src/app/service/utils.service';
import { Dato, RegistroFiltrado } from 'src/app/models/datos.model';
import { Subscription, catchError } from 'rxjs';
import { SpinnerService } from 'src/app/service/spinner.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ChartGeneratorService } from 'src/app/service/chart-generator.service';
// import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(...registerables);
Chart.defaults.font.family = 'DIN-PRO';
Chart.defaults.font.size = 14;
Chart.defaults.font.weight = '400';

@Component({
  selector: 'app-listar-datos',
  templateUrl: './listar-datos.component.html',
  styleUrls: ['./listar-datos.component.css'],
})
export class ListarDatosComponent implements OnInit, OnDestroy {
  listDatos: any;
  listVariables: any[] = [];
  todayDate: Date = new Date();
  sixMonthAgoDate!: Date;
  dato!: Dato;
  sensor_1: string = 'sensor 1';
  sensor_2: string = 'sensor 2';
  pulsador: string = 'Pulsador';
  id: any = 0;
  chart: any;
  chart3: any;
  title: string = 'Prueba angular';
  timeout: any;
  token: any;
  subscription!: Subscription;
  open: boolean = false;
  range!: any;
  rangeSub!: any;
  interval!: any;
  chartList: any = [];
  chartList2: any = [];
  i: any = null;
  tabla: any = 'tabla';
  isOpen = false;
  selectValue: any = [
    {
      option: 'Media',
      value: 'avg',
    },
    {
      option: 'Mínimo',
      value: 'min',
    },
    {
      option: 'Máximo',
      value: 'max',
    },
  ];
  selectedValue = this.selectValue[2].value;
  selectedInterval = this.selectValue[0];

  selectTime: any = [
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
  ];
  selectedTime = this.selectTime[0];

  selectTimeOut: any = [
    {
      option: 'Desactivado',
      value: 'null',
    },
    {
      option: '30Seg',
      value: '30s',
    },
    {
      option: '1 Minuto',
      value: '1m',
    },
    {
      option: '2 Minutos',
      value: '2m',
    },
    {
      option: '5 Minutos',
      value: '5m',
    },
    {
      option: '15 Minutos',
      value: '15m',
    },
  ];

  canvasBackgroundColor = {
    id: 'canvasBackgroundColor',
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
      const {
        ctx,
        chartArea: { top, bottom, left, right, width, height },
        scales: { x, y },
      } = chart;

      function bgColors(
        bracketLow: number,
        bracketHigh: number,
        color: string
      ) {
        ctx.fillStyle = color;
        ctx.fillRect(
          left,
          y.getPixelForValue(bracketHigh),
          width,
          y.getPixelForValue(bracketLow) - y.getPixelForValue(bracketHigh)
        );
      }
      bgColors(
        0,
        parseInt(y._labelItems[y._labelItems.length - 1].label),
        'rgba(111, 151, 255, 0.30)'
      );
    },
  };
  decimation: any = {
    id: 'decimation',
    enabled: true,
    algorithm: 'lttb',
    samples: 100,
    threshold: 50,
  };
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  constructor(
    private _httpService: HttpService,
    private utils: UtilsService,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private spinnerService: SpinnerService,
    private builder: FormBuilder,
    private chartService: ChartGeneratorService
  ) {}

  ngOnInit(): void {
    this.getVariables();
    this.authService.getUser();

    this.range = this.builder.group({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      granularidad: new FormControl<string>('day'),
    });

    this.interval = this.builder.group({
      intervalo: new FormControl<Number | null>(1),
      medida: new FormControl<String | null>('max'),
      tiempo: new FormControl<Number | null>(60 * 60 * 1000),
    });

    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        // hay que arreglar esto para que funcione la data decimation
        // Turn off animations and data parsing for performance
        aspectRatio: 1,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        plugins: {
          decimation: this.decimation,
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {},
            grid: {
              display: false,
            },
          },
          x: {
            type: 'time',

            ticks: {
              source: 'auto',
              // Disabled rotation for performance
              maxRotation: 0,
              autoSkip: true,
            },
            grid: {
              display: false,
            },
          },
        },
      },
      plugins: [this.canvasBackgroundColor], //canvasBackgroundColor,
    });

    this.subscription = this._httpService.listaVariables.subscribe(
      (message: any) => {
        this.listVariables = message;
        this.getRegistros();
      }
    );
    this.expirationCheck();

    this.subscription = this._httpService.listaRegistroFiltrado2.subscribe(
      (message) => {
        console.log('registro filtrado 2:', message);
        this.listDatos = message;
        if (this.listDatos.length != 0) {
          this.spinnerService.detenerSpinner('grafico');
        }
        var sortedList = this.listVariables;
        sortedList = sortedList.map((item: { _id: any }) => {
          const item2 = this.listDatos.find(
            (i2: { _id: any }) => i2._id === item._id
          );
          return item2 ? { ...item, ...item2 } : item;
        });
        console.log('sortedList: ', sortedList);
        for (let i = 0; i < this.listVariables.length; i++) {
          this.chart.data.datasets[i].data = sortedList[i]?.info
            .sort(
              (objA: any, objB: any) =>
                Number(new Date(objA.date)) - Number(new Date(objB.date))
            )
            .map(
              (x: any) =>
                (this.dato = {
                  y: parseFloat(x.max.valor_lectura.toFixed(2)),
                  x: new Date(x.max.fecha_lectura).getTime(),
                })
            );
          this.chart.update();

          if (i == this.listVariables.length - 1) {
            this.spinnerService.detenerSpinner('grafico');
            this.chart.update();
          }
        }
        for (let i = 0; i < this.chartList.length; i++) {
          this.chartList2[i].chart.data.datasets[0].data = sortedList[i]?.info
            .sort(
              (objA: any, objB: any) =>
                Number(new Date(objA.date)) - Number(new Date(objB.date))
            )
            .map(
              (x: any) =>
                (this.dato = {
                  y: parseFloat(x.min.valor_lectura.toFixed(2)),
                  x: new Date(x.min.fecha_lectura).getTime(),
                })
            );
          this.chartList2[i].chart.update();
        }
      }
    );
    this.subscription = this._httpService.rangeInfo.subscribe(
      (message: any) => {
        this.rangeSub = message;
      }
    );
    this.subscription = this.chartService.chartInfo.subscribe(
      (message: any) => {
        console.log('chart info datos: ', message.datos);
        this.changeCurrentValues(
          this.chartList2[message.index].chart,
          message.value,
          message.datos ? message.datos : this.chartList2.datos,
          message.index
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  getRegistros() {
    var inicio = new Date('2023-05-01').getTime().toString();
    var final = new Date('2023-12-31').getTime().toString();
    var sortedList = this.listVariables;
    this.spinnerService.llamarSpinner('grafico');
    this._httpService
      .getValoresFiltrados2(inicio, final, this.range.value.granularidad)
      .subscribe((data) => {
        this.listDatos = data['datos'];

        sortedList = sortedList.map((item: { _id: any }) => {
          const item2 = this.listDatos.find(
            (i2: { _id: any }) => i2._id === item._id
          );
          return item2 ? { ...item, ...item2 } : item;
        });
        if (this.chart.data.datasets.length < this.listVariables.length) {
          for (let j = 0; j < sortedList.length; j++) {
            const dsColor = this.utils.namedColor(
              this.chart.data.datasets.length
            );
            const dataSet = {
              data: [],
              label: sortedList[j].nombre,
              borderColor: dsColor,
              backgroundColor: this.utils.transparentize(dsColor, 0.5),
            };
            this.chart.data.datasets.push(dataSet);
          }
        }

        console.log('sortedList: ', sortedList);
        for (let i = 0; i < this.listVariables.length; i++) {
          this.chart.data.datasets[i].data = sortedList[i]?.info
            .sort(
              (objA: any, objB: any) =>
                Number(new Date(objA.date)) - Number(new Date(objB.date))
            )
            .map(
              (x: any) =>
                (this.dato = {
                  y: parseFloat(x.max.valor_lectura.toFixed(2)),
                  x: new Date(x.max.fecha_lectura).getTime(),
                })
            );
          this.chart.update();

          if (i == this.listVariables.length - 1) {
            this.spinnerService.detenerSpinner('grafico');
            this.chart.update();
          }
        }
        for (let i = 0; i < this.chartList.length; i++) {
          this.chartList2[i].chart.data.datasets[0].data = sortedList[i]?.info
            .sort(
              (objA: any, objB: any) =>
                Number(new Date(objA.date)) - Number(new Date(objB.date))
            )
            .map(
              (x: any) =>
                (this.dato = {
                  y: parseFloat(x.min.valor_lectura.toFixed(2)),
                  x: new Date(x.min.fecha_lectura).getTime(),
                })
            );
          this.chartList2[i].datos = [sortedList[i]];
          this.chartList2[i].chart.update();
        }
      });
  }

  getVariables() {
    this._httpService.getVariables().subscribe((data) => {
      this._httpService.stream_Variables(data);
      console.log(data);

      this.chartList = [
        {
          titulo: data[0] ? data[0].nombre : 'myChart1',
          id: data[0]._id,
        },
        {
          titulo: data[1] ? data[1].nombre : 'myChart2',
          id: data[1]._id,
        },
        {
          titulo: data[2] ? data[2].nombre : 'myChart3',
          id: data[2]._id,
        },
      ];
      setTimeout(() => {
        this.chartService.generate(
          this.chartList,
          this.decimation,
          this.canvasBackgroundColor
        );
        this.chartList2 = this.chartService.getCharts();
        this.chartService.streamCharts(this.chartList2);
      }, 500);
    });
  }

  getFiltrados() {
    var inicio: any = this.range.value.start._d?.getTime().toString();
    var final: any = this.range.value.end._d?.getTime().toString();
    this.spinnerService.llamarSpinner('grafico');
    this._httpService
      .getValoresFiltrados2(inicio, final, this.range.value.granularidad)
      .subscribe((data) => {
        // console.log(data);
        this._httpService.stream_RegistroFiltrado2(data['datos']);
        if (data['datos'].length == 0) {
          this.spinnerService.detenerSpinner('grafico');
        }
      });
  }

  expirationCheck(): void {
    this.token = sessionStorage.getItem('token')?.toString();
    this.timeout =
      this.jwtHelper.getTokenExpirationDate(this.token)!.valueOf() -
      new Date().valueOf();
    this.authService.expirationCounter(this.timeout);
  }
  getDataColors = (opacity?: String) => {
    const colors = [
      '#7448c2',
      '#21c0d7',
      '#d99e2b',
      '#cd3a81',
      '#9c99cc',
      '#e14eca',
      '#ffffff',
      '#ff0000',
      '#d6ff00',
      '#0038ff',
    ];
    return colors.map((color) => (opacity ? `${color + opacity}` : color));
  };

  setInicio_final() {
    var inicio: any = this.range.value.start._d?.getTime().toString();
    var final: any = this.range.value.end._d?.getTime().toString();
    this._httpService.set_Inicio_Final(inicio, final);
    var difference = parseInt(final) - parseInt(inicio);
    if (difference < this.selectTime[4].value) {
      this.setInterval({
        binSize: 15,
        unit: 'minute',
      });
    } else if (difference < this.selectTime[5].value) {
      this.setInterval({
        binSize: 1,
        unit: 'hour',
      });
    } else if (difference < this.selectTime[5].value * 3) {
      this.setInterval({
        binSize: 6,
        unit: 'hour',
      });
    } else {
      this.setInterval({
        binSize: 1,
        unit: 'day',
      });
    }
  }

  toggleIsOpen() {
    this.isOpen = !this.isOpen;
    console.log('is open value', this.isOpen);
  }
  changeCurrentValues(chart: any, val: string, datos: any, index?: number) {
    console.log('change current values: ', val);
    var sortedList = this.listVariables;
    sortedList = sortedList
      .map((item: { _id: any }) => {
        const item2 = datos.find((i2: { _id: any }) => i2._id === item._id);
        return item2;
      })
      .filter((e) => {
        return e !== undefined;
      });
    console.log('change current values sorted list: ', sortedList);
    if (datos.length > 0) {
      switch (val) {
        case 'max':
          for (let i = 0; i < sortedList.length; i++) {
            chart.data.datasets[i].data = sortedList[i]?.info
              .sort(
                (objA: any, objB: any) =>
                  Number(new Date(objA.date)) - Number(new Date(objB.date))
              )
              .map(
                (x: any) =>
                  (this.dato = {
                    y: parseFloat(x.max.valor_lectura.toFixed(2)),
                    x: new Date(x.max.fecha_lectura).getTime(),
                  })
              );
            chart.update();

            if (i == sortedList.length - 1) {
              this.spinnerService.detenerSpinner('grafico');
              console.log('sorted list: ', sortedList);

              chart.update();
            }
          }
          break;

        case 'min':
          for (let i = 0; i < sortedList.length; i++) {
            chart.data.datasets[i].data = sortedList[i]?.info
              .sort(
                (objA: any, objB: any) =>
                  Number(new Date(objA.date)) - Number(new Date(objB.date))
              )
              .map(
                (x: any) =>
                  (this.dato = {
                    y: parseFloat(x.min.valor_lectura.toFixed(2)),
                    x: new Date(x.min.fecha_lectura).getTime(),
                  })
              );
            chart.update();

            if (i == sortedList.length - 1) {
              this.spinnerService.detenerSpinner('grafico');
              console.log('sorted list: ', sortedList);

              chart.update();
            }
          }
          break;

        case 'avg':
          for (let i = 0; i < sortedList.length; i++) {
            chart.data.datasets[i].data = sortedList[i]?.info
              .sort(
                (objA: any, objB: any) =>
                  Number(new Date(objA.date)) - Number(new Date(objB.date))
              )
              .map(
                (x: any) =>
                  (this.dato = {
                    y: parseFloat(x.avg.toFixed(2)),
                    x: new Date(x.date).getTime(),
                  })
              );
            chart.update();

            if (i == sortedList.length - 1) {
              this.spinnerService.detenerSpinner(`grafico${index}`);
              console.log('sorted list: ', sortedList);

              chart.update();
            }
          }
          break;

        default:
          break;
      }
    } else {
      console.log('no hay datos');
    }
  }

  getValuesByInterval() {
    const currentDateObj = new Date();
    const final = this.rangeSub[1]
      ? this.rangeSub[1]
      : currentDateObj.getTime();
    const millis = this.selectedTime;
    const inicio = this.rangeSub[1] ? this.rangeSub[0] : final - millis;

    this.spinnerService.llamarSpinner('grafico');
    this._httpService
      .getInterval(
        inicio,
        final,
        this.selectedInterval.unit,
        this.selectedInterval.binSize
      )
      .pipe(
        catchError(async (error) => {
          console.log(error.message);
          return error;
        })
      )
      .subscribe((data) => {
        this.listDatos = data['datos'];
        console.log('getInterval: ', data);

        this.spinnerService.detenerSpinner('grafico');

        this.changeCurrentValues(
          this.chart,
          this.selectedValue,
          this.listDatos
        );
      });
  }
  setTime(time: any) {
    this.rangeSub = [];
    this.selectedTime = time;
  }
  setInterval(interval: any) {
    console.log('set interval', interval);
    this.selectedInterval = interval;
  }
  setValue(value: any) {
    this.selectedValue = value;
    this.changeCurrentValues(this.chart, this.selectedValue, this.listDatos);
  }
}
