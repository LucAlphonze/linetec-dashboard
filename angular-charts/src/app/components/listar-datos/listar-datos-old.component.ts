import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { Chart, TooltipItem, registerables } from 'node_modules/chart.js';
import 'chartjs-adapter-date-fns';
import { AuthService } from 'src/app/service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilsService } from 'src/app/service/utils.service';
import { Dato, RegistroFiltrado } from 'src/app/models/datos.model';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/service/spinner.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
// import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(...registerables);

@Component({
  selector: 'app-listar-datos-old',
  templateUrl: './listar-datos-old.component.html',
  styleUrls: ['./listar-datos.component.css'],
})
export class ListarDatosComponentOld implements OnInit {
  listDatos: any[] = [];
  listDatos2: RegistroFiltrado[] = [];
  listVariables: any[] = [];
  listCheckbox: any[] = [];
  chartList: any[] = [];
  todayDate: Date = new Date();
  sixMonthAgoDate!: Date;
  dato!: Dato;
  chart: any;
  chart3: any;
  title: string = 'Prueba angular';
  timeout: any;
  token: any;
  subscription!: Subscription;
  subscription2!: Subscription;
  isAdminUser: boolean = false;
  chartUrl: string = environment.API_URL_CHARTS;

  canvasBackgroundColor = {
    id: 'canvasBackgroundColor',
    beforeDraw(chart: any, args: any, pluginOptions: any) {
      const {
        ctx,
        chartArea: { top, bottom, left, right, width },
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
      bgColors(26.5, 35, 'rgba(255, 26, 104, 0.2)');
      bgColors(24, 26.5, 'rgba(75, 192, 192, 0.2)');
      bgColors(0, 24, 'rgba(255, 206, 86, 0.2)');
    },
  };
  decimation: any = {
    id: 'decimation',
    enabled: true,
    algorithm: 'lttb',
    samples: 100,
    threshold: 90,
  };

  opciones: any = {
    aspectRatio: 1,
    maintainAspectRatio: false,
    animation: false,
    parsing: false,
    plugins: {
      decimation: this.decimation,
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        ticks: {},
        grid: {},
      },
      'second-y-axis': {
        type: 'linear',
        position: 'right',
      },
      x: {
        type: 'time',
        time: {
          displayFormats: {
            day: 'dd/MM/yyyy',
          },
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
        },
      },
    },
  };

  constructor(
    private _httpService: HttpService,
    private utils: UtilsService,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private spinnerService: SpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.addMonths(this.todayDate, -6);
    this.getVariables();
    this.getChartsOnStartUp();
    this.getUserRole();
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            yAxisID: 'y',
            data: [],
          },
          {
            data: [],
          },
          {
            yAxisID: 'second-y-axis',
            data: [],
          },
        ],
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
          tooltip: {
            callbacks: {
              label: function (tooltipItem: TooltipItem<'line'>) {
                let label = tooltipItem.formattedValue;
                //   this.chart.data.datasets[
                //     tooltipItem.dataIndex
                //   ].data[0]?.toString() || '';
                return label;
              },
              title: function (context) {
                let title = '';
                // = context.forEach((e) => {
                //   e.label = e.formattedValue;
                // });
                return title;
              },
            },
          },
        },
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {},
            grid: {},
          },
          'second-y-axis': {
            type: 'linear',
            position: 'right',
          },
          x: {
            type: 'time',
            time: {
              displayFormats: {
                day: 'dd/MM/yyyy',
              },
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
            },
          },
        },
      },
      plugins: [this.canvasBackgroundColor],
    });

    this.chart3 = new Chart('myChart3', {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: this.getDataColors(),
            backgroundColor: this.getDataColors('20'),
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: 'left' },
        },
        maintainAspectRatio: false,
      },
    });
    this.subscription = this._httpService.listaRegistroFiltrado.subscribe(
      (message) => {
        this.listDatos2 = message;
        this.chart3.data.labels = this.listDatos2.map((x) => x._id);
        this.chart3.data.datasets[0].data = this.listDatos2.map((x) => x.avg);
        this.chart3.update();
      }
    );
    this.expirationCheck();

    this.subscription = this._httpService.listaRegistroFiltrado2.subscribe(
      (message: any) => {
        console.log('mensaje registro filtrado 2: ', message);
        this.listDatos = message;
        if (this.listDatos.length != 0) {
          this.spinnerService.detenerSpinner('grafico');
        }
        this.chart.data.datasets[0].data = this.listDatos.map(
          (x) =>
            (this.dato = {
              y: parseFloat(x.max.toFixed(2)),
              x: new Date(x._id).getTime() + 10800000,
            })
        );
        this.chart.data.datasets[1].data = this.listDatos.map(
          (x) =>
            (this.dato = {
              y: parseFloat(x.min.toFixed(2)),
              x: new Date(x._id).getTime() + 10800000,
            })
        );

        this.chart.update();

        console.log(
          'data set 0: ',
          this.chart.data.datasets[0].data.length,
          'data set 1: ',
          this.chart.data.datasets[1].data.length
        );
      }
    );
    this.subscription2 = this._httpService.listChartInfo.subscribe(
      (message) => {
        this.poblarChartArray(message);
      }
    );
  }

  // getRegistros() {
  //   this._httpService
  //     .getValores(this.listVariables[1]._id)
  //     .subscribe((data) => {
  //       this.listDatos = data['datos'];
  //       this.chart.data.datasets[0].data = this.listDatos
  //         .map(
  //           (x) =>
  //             (this.dato = {
  //               y: parseFloat(x.max.toFixed(2)),
  //               x: new Date(x._id).getTime() + 10800000,
  //             })
  //         )
  //         .filter((x) => {
  //           return x.x > new Date('2023-04-30').getTime();
  //         });
  //       this.chart.data.datasets[1].data = this.listDatos
  //         .map(
  //           (x) =>
  //             (this.dato = {
  //               y: parseFloat(x.min.toFixed(2)),
  //               x: new Date(x._id).getTime() + 10800000,
  //             })
  //         )
  //         .filter((x) => {
  //           return x.x > new Date('2023-04-30').getTime();
  //         });
  //       this.chart.update();
  //       console.log('datos: ', this.chart.data.datasets[0].data);
  //     });
  // }

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
      // this.getRegistros();
      this.chart.data.datasets[0].label = 'Pressione estrusione max';
      this.chart.data.datasets[1].label = 'Pressione estrusione min';
      this.chart.data.datasets[2].label = 'Corrente motore estrusore max';
      this.getFiltrados();
    });
  }
  getFiltrados() {
    var inicio: any = this.sixMonthAgoDate.getTime().toString();
    var final: any = this.todayDate.getTime().toString();
    this._httpService
      .getAllInRange(this.listVariables[1]._id, inicio, final)
      .subscribe((data) => {
        console.log(data);
        this._httpService.stream_RegistroFiltrado(data['datos']);
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

  poblarChartArray(createdChartItem: any) {
    this.authService.postForm(this.chartUrl, createdChartItem).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Chart registrado correctamente');
          this._httpService.httpGet(this.chartUrl).subscribe((data: any) => {
            this.chartList = data['datos'];
            if (this.chartList.length > 0) {
              console.log('si hay datos: ', data);
              for (let i = 0; i < this.chartList.length; i++) {
                setTimeout(() => {
                  this.renderChartOnStartUp(this.chartList[i]);
                }, 500);
              }
            } else {
              console.log('no hay datos: ', data);
              setTimeout(() => {
                this.renderChart(createdChartItem);
              }, 500);
            }
          });
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  renderChart(createdChartItem: any) {
    var inicio = new Date('2023-05-01').getTime().toString();
    var final = new Date('2024-12-31').getTime().toString();
    let datosRenderChart: any[] = [];

    const createdChart = new Chart(createdChartItem.nombre, {
      type: createdChartItem.tipo,
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        aspectRatio: 1,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        plugins: {
          decimation: this.decimation,
        },
        scales: {
          y: {
            type: 'linear',
          },
          x: {
            type: 'time',
            ticks: {
              source: 'auto',
              maxRotation: 0,
              autoSkip: true,
            },
          },
        },
      },
    });
    // console.log('variable values: ', createdChartItem.variable);
    // return;

    for (let i = 0; i < createdChartItem.variable.length; i++) {
      const dsColor = this.utils.namedColor(i);

      this._httpService
        .getAllInRange(createdChartItem.variable[i]._id, inicio, final)
        .subscribe((message) => {
          datosRenderChart = message['datos'];
          const newDataset = {
            label: createdChartItem.variable[i].nombre,
            data: datosRenderChart
              .map(
                (x) =>
                  (this.dato = {
                    y: parseFloat(x.max.toFixed(2)),
                    x: new Date(x._id).getTime() + 10800000,
                  })
              )
              .filter((x) => {
                return x.x > new Date('2023-04-30').getTime();
              }),
            backgroundColor: this.utils.transparentize(dsColor, 0.5),
            borderColor: dsColor,
          };
          createdChart.data.datasets.push(newDataset);

          createdChart.update();
        });
    }
    // console.log('created Chart: ', createdChart);
  }

  removerCharts(nombre: string, id: string) {
    this.chartList = this.chartList.filter((chart) => {
      return chart.nombre != nombre;
    });
    this.authService.deleteForm(this.chartUrl, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Chart borrado correctamente');
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  renderChartOnStartUp(chart: any) {
    var inicio = new Date('2023-05-01').getTime().toString();
    var final = new Date('2024-12-31').getTime().toString();
    let datosRenderChart: any[] = [];
    const createdChart = new Chart(chart.nombre, {
      type: chart.tipo,
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        aspectRatio: 1,
        maintainAspectRatio: false,
        animation: false,
        parsing: false,
        plugins: {
          decimation: this.decimation,
        },
        scales: {
          y: {
            type: 'linear',
          },
          x: {
            type: 'time',
            ticks: {
              source: 'auto',
              maxRotation: 0,
              autoSkip: true,
            },
          },
        },
      },
    });

    this._httpService.stream_ChartData_Info(createdChart);
    for (let i = 0; i < chart.variables.length; i++) {
      const dsColor = this.utils.namedColor(i);
      this._httpService
        .getAllInRange(chart.variables[i]._id, inicio, final)
        .subscribe((message) => {
          // console.log(
          //   'render chart datos',
          //   message,
          //   'variable:',
          //   chart.variables[i].nombre
          // );
          datosRenderChart = message['datos'];
          const newDataset = {
            label: chart.variables[i].nombre,
            data: datosRenderChart
              .map(
                (x) =>
                  (this.dato = {
                    y: parseFloat(x.max.toFixed(2)),
                    x: new Date(x._id).getTime() + 10800000,
                  })
              )
              .filter((x) => {
                return x.x > new Date('2023-04-30').getTime();
              }),
            backgroundColor: this.utils.transparentize(dsColor, 0.5),
            borderColor: dsColor,
          };
          createdChart.data.datasets.push(newDataset);

          createdChart.update();
        });
    }
    // console.log('created Chart: ', createdChart);
  }

  getChartsOnStartUp() {
    this._httpService.httpGet(this.chartUrl).subscribe((data: any) => {
      this.chartList = data['datos'];
      if (this.chartList.length > 0) {
        console.log('si hay datos: ', data);
        for (let i = 0; i < this.chartList.length; i++) {
          setTimeout(() => {
            this.renderChartOnStartUp(this.chartList[i]);
          }, 500);
        }
      } else {
        console.log('no hay datos: ', data);
      }
    });
  }

  getUserRole() {
    const userRole = this.authService.getUserRole();
    if (userRole === 'admin') {
      this.isAdminUser = true;
    } else {
      this.isAdminUser = false;
    }
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
}
