import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'date-fns/locale';
import { Subject } from 'rxjs';
import { HttpService } from './http.service';
import { UtilsService } from './utils.service';
import { Dato } from '../models/datos.model';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
Chart.register(...registerables);
Chart.defaults.font.family = 'DIN-PRO';
Chart.defaults.font.size = 14;
Chart.defaults.font.weight = '400';

@Injectable({
  providedIn: 'root',
})
export class ChartGeneratorService {
  chartList: any = [];
  dato!: Dato;
  decimation: any = {
    id: 'decimation',
    enabled: true,
    algorithm: 'lttb',
    samples: 100,
    threshold: 1000,
  };
  private chartListSource = new Subject();
  private chartRangeSource = new Subject();
  private chartIntervalInfoSource = new Subject();

  listaDeCharts = this.chartListSource.asObservable();
  rangeInfo = this.chartRangeSource.asObservable();
  chartInfo = this.chartIntervalInfoSource.asObservable();

  constructor(
    private _httpService: HttpService,
    private utils: UtilsService,
    private _authService: AuthService,
    private toastr: ToastrService
  ) {}

  renderChart(chartList: any, canvasBackgroundColor: any, listDatos: any) {
    var inicio = new Date('2023-05-01').getTime().toString();
    var final = new Date('2024-12-31').getTime().toString();
    let datosRenderChart: any[] = [];
    for (let j = 0; j < chartList.length; j++) {
      var chartItem = chartList[j];
      const createdChart = {
        chart: new Chart(chartItem.nombre, {
          type: chartItem.tipo,
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
            elements: {
              line: {
                tension: 0.5,
              },
            },
            scales: {
              y: {
                type: 'linear',
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
          plugins: [canvasBackgroundColor],
        }),
        titulo: chartItem.nombre,
        variables: chartItem.variables,
        index: chartList.length,
      };

      for (let i = 0; i < chartItem.variables.length; i++) {
        const dsColor = this.utils.namedColor(i);
        console.log('chart item variables', chartItem.variables);
        console.log('list datos', listDatos);
        var sortedList = chartItem.variables;
        sortedList = sortedList.map((item: { _id: any }) => {
          const item2 = listDatos.find(
            (i2: { _id: any }) => i2._id === item._id
          );
          return item2 ? { ...item, ...item2 } : item;
        });
        sortedList = sortedList.filter((e: any) => 'info' in e);
        if (createdChart.chart.data.datasets.length < sortedList.length) {
          for (let j = 0; j < sortedList.length; j++) {
            const dataSet = {
              data: [],
              label: sortedList[j].nombre,
              borderColor: dsColor,
              backgroundColor: this.utils.transparentize(dsColor, 0.5),
            };
            createdChart.chart.data.datasets.push(dataSet);
          }
        }

        console.log('sortedList: ', sortedList);
        for (let i = 0; i < sortedList.length; i++) {
          createdChart.chart.data.datasets[i].data = sortedList[i]?.info
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
          createdChart.chart.update();

          if (i == sortedList.length - 1) {
            createdChart.chart.update();
            this.chartList.push(createdChart);
          }
        }
      }
    }

    // console.log('variable values: ', chartList.variable);
    // return;
    // console.log('created Chart: ', createdChart);
  }

  // generate(idList: any[], decimation: any, canvasBackgroundColor?: any) {
  //   this.chartList = [];
  //   for (let i = 0; i < idList.length; i++) {
  //     var generatedChart = {
  //       chart: new Chart(idList[i].titulo, {
  //         type: 'line',
  //         data: {
  //           labels: [],
  //           datasets: [
  //             {
  //               data: [],
  //               borderColor: '#062984',
  //               backgroundColor: 'rgba(6, 41, 132, 0.35)',
  //               label: idList[i].titulo,
  //             },
  //           ],
  //         },
  //         options: {
  //           // hay que arreglar esto para que funcione la data decimation
  //           // Turn off animations and data parsing for performance
  //           aspectRatio: 1,
  //           maintainAspectRatio: false,
  //           animation: false,
  //           parsing: false,
  //           plugins: {
  //             decimation: decimation,
  //           },
  //           elements: {
  //             line: {
  //               tension: 0.5,
  //             },
  //           },
  //           scales: {
  //             y: {
  //               type: 'linear',
  //               beginAtZero: true,
  //               ticks: {},
  //               grid: {
  //                 display: false,
  //               },
  //             },
  //             x: {
  //               type: 'time',

  //               ticks: {
  //                 source: 'auto',
  //                 // Disabled rotation for performance
  //                 maxRotation: 0,
  //                 autoSkip: true,
  //               },
  //               grid: {
  //                 display: false,
  //               },
  //             },
  //           },
  //         },
  //         plugins: [canvasBackgroundColor],
  //       }),
  //       titulo: idList[i].titulo,
  //       variable: idList[i].id,
  //       id: i,
  //     };
  //     this.chartList.push(generatedChart);
  //   }
  //   console.log('generated charts: ', this.chartList);
  // }

  getCharts() {
    return this.chartList;
  }
  streamCharts(chartList: any) {
    this.chartListSource.next(chartList);
  }
  set_Inicio_Final(inicio: string, final: string) {
    this.chartRangeSource.next([inicio, final]);
  }
  streamChartIntervalInfo(chartInfo: any) {
    this.chartIntervalInfoSource.next(chartInfo);
  }
  removerCharts(chartUrl: string, nombre: string, id: string) {
    this.chartList = this.chartList.filter((chart: any) => {
      return chart.nombre != nombre;
    });
    this._authService.deleteForm(chartUrl, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Chart borrado correctamente');
          this._httpService.stream_Chart_Info(this.chartList);
          // for (let i = 0; i < this.chartList.length; i++) {
          //   this.chartList[i].chart.update();
          // }
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
}
