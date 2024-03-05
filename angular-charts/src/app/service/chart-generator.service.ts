import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'date-fns/locale';
Chart.register(...registerables);
Chart.defaults.font.family = 'DIN-PRO';
Chart.defaults.font.size = 14;
Chart.defaults.font.weight = '400';
@Injectable({
  providedIn: 'root',
})
export class ChartGeneratorService {
  chartList: any = [];
  constructor() {}

  generate(idList: any[], decimation: any, canvasBackgroundColor?: any) {
    this.chartList = [];
    for (let i = 0; i < idList.length; i++) {
      var generatedChart = {
        chart: new Chart(idList[i].titulo, {
          type: 'line',
          data: {
            labels: [],
            datasets: [
              {
                data: [],
                borderColor: '#062984',
                backgroundColor: 'rgba(6, 41, 132, 0.35)',
                label: idList[i].titulo + ' minimo',
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
              decimation: decimation,
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
          plugins: [],
        }),
        titulo: idList[i].titulo,
        id: idList[i].id,
      };
      this.chartList.push(generatedChart);
    }
    console.log('generated charts: ', this.chartList);
  }

  getCharts() {
    return this.chartList;
  }
}
