import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/service/http-service.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { AuthService } from 'src/app/service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilsService } from 'src/app/service/utils.service';
import { RegistroFiltrado } from 'src/app/models/datos.model';
import { Subscription } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-listar-datos',
  templateUrl: './listar-datos.component.html',
  styleUrls: ['./listar-datos.component.css'],
})
export class ListarDatosComponent implements OnInit, OnDestroy {
  listDatos: any[] = [];
  listVariables: any[] = [];
  listCheckbox: any[] = [];
  sensor_1: string = 'sensor 1';
  sensor_2: string = 'sensor 2';
  pulsador: string = 'Pulsador';
  id: any = 0;
  chart: any;
  chart2: any;
  chart3: any;
  chart4: any;
  title: string = 'Prueba angular';
  timeout: any;
  token: any;
  subscription!: Subscription;
  listDatos2: RegistroFiltrado[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(
    private _httpService: HttpServiceService,
    private utils: UtilsService,
    private authService: AuthService,
    private jwtHelper: JwtHelperService
  ) {
    // Preparing the chart data
  }

  ngOnInit(): void {
    this.getVariables();
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        aspectRatio: 1,
        maintainAspectRatio: false,
      },
    });
    this.chart2 = new Chart('myChart2', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Corte Maximo por mes',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: {
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        aspectRatio: 1,
        maintainAspectRatio: false,
      },
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
    this.chart4 = new Chart('myChart4', {
      type: 'radar',
      data: {
        labels: ['Max', 'Min', 'Avg'],
        datasets: [],
      },
      options: {
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        maintainAspectRatio: false,
      },
    });
    this.subscription = this._httpService.listaDatos.subscribe((message) => {
      this.chart4.data.datasets = [];
      this.listDatos2 = message;
      this.chart3.data.labels = this.listDatos2.map((x) => x._id);
      this.chart3.data.datasets[0].data = this.listDatos2.map(
        (x) => x.respuesta
      );
      this.chart3.update();
      this.chart2.data.labels = this.listDatos2.map((x) => x._id);
      this.chart2.data.datasets[0].data = this.listDatos2.map(
        (x) => x.respuesta
      );
      this.chart2.update();
      // this.chart4.data.datasets[0].data = this.listDatos2.map(
      //   (x) => x.respuesta
      // );
      this.listDatos2.forEach((datos) => {
        const dsColor = this.utils.namedColor(this.chart4.data.datasets.length);
        var newDataSet = {
          label: datos._id,
          backgroundColor: this.utils.transparentize(dsColor, 0.5),
          borderColor: dsColor,
          data: [datos.respuesta, datos.min, datos.avg],
        };
        this.chart4.data.datasets.push(newDataSet);
      });
      this.chart4.update();
    });
    this.expirationCheck();
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
        console.log('datos: ', this.listDatos);
        this.chart.data.labels = this.listDatos.map((x) =>
          new Date(x._id).toLocaleDateString()
        );
        console.log('despues del for each', this.chart.data.labels);
        this.chart.data.datasets[0].data = this.listDatos.map((x) => x.max);
        this.chart.update();
      });
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
      this.getRegistros();
      this.chart.data.datasets[0].label = 'Corte maximo por dia';
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
}
