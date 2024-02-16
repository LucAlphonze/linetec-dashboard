import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { Chart, registerables } from 'node_modules/chart.js';
import 'chartjs-adapter-date-fns';
import 'date-fns/locale';
import { AuthService } from 'src/app/service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilsService } from 'src/app/service/utils.service';
import { Dato, RegistroFiltrado } from 'src/app/models/datos.model';
import { Subscription } from 'rxjs';
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
  listDatos: any[] = [];

  listDatos2: RegistroFiltrado[] = [];
  listDatos3: any[] = [];
  listVariables: any[] = [];
  listCheckbox: any[] = [];
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
  chartList: any = [
    { titulo: 'myChart2' },
    { titulo: 'myChart3' },
    { titulo: 'myChart4' },
  ];
  chartList2: any = [];

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
        parseInt(y._labelItems[6].label),
        parseInt(y._labelItems[y._labelItems.length - 1].label),
        'rgba(23, 88, 255, 0.30)'
      );
      bgColors(
        parseInt(y._labelItems[5].label),
        parseInt(y._labelItems[6].label),
        'rgba(6, 41, 132, 0.35)'
      );
      bgColors(
        parseInt(y._labelItems[0].label),
        y._labelItems[5].label,
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
    this.addMonths(this.todayDate, -6);
    this.getVariables();
    this.authService.getUser();
    setTimeout(() => {
      this.chartService.generate(
        this.chartList,
        this.decimation,
        this.canvasBackgroundColor
      );
      this.chartList2 = this.chartService.getCharts();
    }, 500);
    this.range = this.builder.group({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      granularidad: new FormControl<string>('day'),
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
          'second-y-axis': {
            type: 'linear',
            position: 'right',
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
      plugins: [this.canvasBackgroundColor],
    });

    // this.subscription = this._httpService.listaRegistroFiltrado2.subscribe(
    //   (message) => {
    //     this.listDatos2 = message;
    //   }
    // );
    this.expirationCheck();

    this.subscription = this._httpService.listaRegistroFiltrado2.subscribe(
      (message) => {
        console.log('registro filtrado 2:', message);
        this.listDatos = message;
        if (this.listDatos.length != 0) {
          this.spinnerService.detenerSpinner('grafico');
        }
        var sortedList = this.listDatos;

        for (let i = 0; i < this.listDatos.length; i++) {
          this.chart.data.datasets[i].data = sortedList[i]?.info
            .sort(
              (objA: any, objB: any) =>
                Number(new Date(objA.date)) - Number(new Date(objB.date))
            )
            .map(
              (x: any) =>
                (this.dato = {
                  y: parseFloat(x.max.valor_lectura.toFixed(2)),
                  x: new Date(x.max.time_stamp).getTime(),
                })
            );
          console.log(this.chart.data.datasets[i].data);
        }
        this.chart.update();

        // this.chart.data.datasets[1].data = this.listDatos.map(
        //   (x) =>
        //     (this.dato = {
        //       y: parseFloat(x.min.toFixed(2)),
        //       x: new Date(x._id).getTime() + 10800000,
        //     })
        // );

        // console.log(this.chartList2);
        for (let i = 0; i < this.chartList2.length; i++) {
          this.chartList2[i].chart.data.datasets[0].data = sortedList[
            i + 2
          ]?.info
            .sort(
              (objA: any, objB: any) =>
                Number(new Date(objA.date)) - Number(new Date(objB.date))
            )
            .map(
              (x: any) =>
                (this.dato = {
                  y: parseFloat(x.max.valor_lectura.toFixed(2)),
                  x: new Date(x.max.time_stamp).getTime(),
                })
            );
          this.chartList2[i].chart.data.datasets[0].label =
            this.listVariables[i + 2].nombre;
          this.chartList2[i].chart.update();
        }
      }
    );

    // this.subscription = this._httpService.listaDatos3.subscribe((message) => {
    //   this.listDatos3 = message;

    //   this.chart.data.datasets[2].data = this.listDatos3.map(
    //     (x) =>
    //       (this.dato = {
    //         y: parseFloat(x.max.toFixed(2)),
    //         x: new Date(x._id).getTime() + 10800000,
    //       })
    //   );
    this.chart.update();
    // });
  }

  ngOnDestroy(): void {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  getRegistros() {
    this._httpService
      .getValores(this.listVariables[1]._id)
      .subscribe((data) => {
        this.listDatos = data['datos'];
        this.chart.data.datasets[0].data = this.listDatos
          .map(
            (x) =>
              (this.dato = {
                y: parseFloat(x.max.toFixed(2)),
                x: new Date(x._id).getTime() + 10800000,
              })
          )
          .filter((x) => {
            return x.x > new Date('2023-04-30').getTime();
          });
        this.chart.data.datasets[1].data = this.listDatos
          .map(
            (x) =>
              (this.dato = {
                y: parseFloat(x.min.toFixed(2)),
                x: new Date(x._id).getTime() + 10800000,
              })
          )
          .filter((x) => {
            return x.x > new Date('2023-04-30').getTime();
          });
        this.chart.update();
        console.log('datos: ', this.chart.data.datasets[0].data);
      });
    // this._httpService
    //   .getValores(this.listVariables[4]._id)
    //   .subscribe((data) => {
    //     this.listDatos3 = data['datos'];
    //     this.chart.data.datasets[2].data = this.listDatos3
    //       .map(
    //         (x) =>
    //           (this.dato = {
    //             y: parseFloat(x.max.toFixed(2)),
    //             x: new Date(x._id).getTime() + 10800000,
    //           })
    //       )
    //       .filter((x) => {
    //         return x.x > new Date('2023-04-30').getTime();
    //       });
    //     this.chart.update();
    //     console.log('datos: ', this.chart.data.datasets[2].data);
    //   });
  }

  makeCheckboxArray(value: any) {
    let newValue = JSON.parse(value.source._value);
    console.log('chip presionado', newValue);
    if (value.selected == true) {
      this.listCheckbox.push(newValue);
    } else {
      function desmarcar(valor: any) {
        return value.source._value != valor;
      }
      this.listCheckbox = this.listCheckbox.filter((x) => desmarcar(x));
    }
    console.log(this.listCheckbox);
  }
  getVariables() {
    this._httpService.getVariables().subscribe((data) => {
      this._httpService.stream_Variables(data);
      this.listVariables = data;
      console.log(this.listVariables);
      for (let i = 0; i < this.listVariables.length; i++) {
        const dsColor = this.utils.namedColor(this.chart.data.datasets.length);
        const dataSet = {
          data: [],
          label: this.listVariables[i].nombre,
          borderColor: dsColor,
          backgroundColor: this.utils.transparentize(dsColor, 0.5),
        };
        this.chart.data.datasets.push(dataSet);
      }
      this.getRegistros();

      // this.chart.data.datasets[2].label = 'Corrente motore estrusore max';
      // this.getFiltrados();
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
  getDaysInMonth = (year: number, month: number) =>
    new Date(year, month, 0).getDate();

  addMonths = (input: Date, months: number) => {
    const date = new Date(input);
    date.setDate(1);
    date.setMonth(date.getMonth() + months);
    date.setDate(
      Math.min(
        input.getDate(),
        this.getDaysInMonth(date.getFullYear(), date.getMonth() + 1)
      )
    );
    this.sixMonthAgoDate = date;
  };

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

  openMenu() {
    this.trigger.openMenu();
  }
  setInicio_final() {
    var inicio: any = this.range.value.start._d?.getTime().toString();
    var final: any = this.range.value.end._d?.getTime().toString();
    this._httpService.set_Inicio_Final(inicio, final);
  }
}
