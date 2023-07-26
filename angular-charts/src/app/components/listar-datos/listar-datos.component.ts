import { Component, OnDestroy, OnInit } from '@angular/core';
import { Datos } from 'src/app/models/datos.model';
import { HttpServiceService } from 'src/app/service/http-service.service';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-listar-datos',
  templateUrl: './listar-datos.component.html',
  styleUrls: ['./listar-datos.component.css'],
})
export class ListarDatosComponent implements OnInit, OnDestroy {
  listDatos: any[] = [];
  sensor_1: string = 'sensor 1';
  sensor_2: string = 'sensor 2';
  pulsador: string = 'Pulsador';
  id: any = 0;
  chart: any;
  title: string = 'Prueba angular';
  constructor(private _httpService: HttpServiceService) {
    // Preparing the chart data
  }

  ngOnInit(): void {
    setInterval(() => {
      this._httpService.getValores().subscribe((data) => {
        this.listDatos = data['datos'];
        console.log(this.listDatos);
        this.chart.data.datasets[0].data = this.listDatos
          .filter((x) => x.id_variable.nombre == this.sensor_1)
          .map((x) => x.valor_lectura);
        this.chart.data.datasets[1].data = this.listDatos
          .filter((x) => x.id_variable.nombre == this.sensor_2)
          .map((x) => x.valor_lectura);
        this.chart.data.datasets[2].data = this.listDatos
          .filter((x) => x.id_variable.nombre == this.pulsador)
          .map((x) => x.valor_lectura);

        this.chart.data.labels = this.listDatos.map((x) => x.fecha_lectura);
        this.chart.update();
        console.log(
          'despues del for each',
          this.chart.data.labels,
          this.chart.data.datasets[0].data,
          this.chart.data.datasets[1].data,
          this.chart.data.datasets[2].data
        );
      });
    }, 10000);

    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'sensor 1',
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            data: [],
            label: 'sensor 2',
            fill: false,
            borderColor: 'rgba(255, 0, 0)',
            tension: 0.1,
          },
          {
            data: [],
            label: 'pulsador',
            fill: false,
            borderColor: 'rgba(0, 255, 0)',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  ngOnDestroy(): void {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}
