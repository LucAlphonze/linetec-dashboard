import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/service/http-service.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { AuthService } from 'src/app/service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilsService } from 'src/app/service/utils.service';
Chart.register(...registerables);

@Component({
  selector: 'app-listar-datos',
  templateUrl: './listar-datos.component.html',
  styleUrls: ['./listar-datos.component.css'],
})
export class ListarDatosComponent implements OnInit, OnDestroy {
  listDatos: any[] = [];
  listDatos2: any[] = [];
  listVariables: any[] = [];
  listCheckbox: any[] = [];
  sensor_1: string = 'sensor 1';
  sensor_2: string = 'sensor 2';
  pulsador: string = 'Pulsador';
  id: any = 0;
  chart: any;
  chart2: any;
  chart3: any;
  title: string = 'Prueba angular';
  timeout: any;
  token: any;
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
      },
    });
    this.chart2 = new Chart('myChart2', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [],
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
      },
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
          new Date(x.fecha_lectura).toLocaleDateString()
        );
        console.log('despues del for each', this.chart.data.labels);
        this.chart.data.datasets[0].data = this.listDatos.map(
          (x) => x.valor_lectura
        );
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
      this.listVariables = data;
      console.log(this.listVariables);
      this.getRegistros();
      this.chart.data.datasets[0].label = this.listVariables[2].nombre;
      // for (let i = 0; i < this.listVariables.length; i++) {
      //   this.chart.data.datasets[i] = {
      //     data: [],
      //     label: [this.listVariables[i].nombre],
      //     fill: false,
      //     borderColor: this.getDataColors(),
      //     backgroundColor: this.getDataColors('20'),
      //     tension: 0.1,
      //   };
      // }
    });
  }
  getFiltrados() {
    var inicio: any = this.range.value.start?.getTime().toString();
    var final: any = this.range.value.end?.getTime().toString();
    this._httpService
      .getValoresFiltrados(this.listVariables[2], inicio, final, 'max')
      .subscribe((data) => {
        console.log(data);
        this.listDatos2 = data['datos'];
        this.chart3.data.labels = this.listDatos2.map((x) => x._id);
        this.chart3.data.datasets[0].data = this.listDatos2.map(
          (x) => x.respuesta
        );
        this.chart3.update();
        // this.chart2.data.labels = this.listDatos.map((x) => {
        //   x._id;
        // });

        this.listDatos2.forEach((datos) => {
          const dsColor = this.utils.namedColor(
            this.chart2.data.datasets.length
          );
          var newDataSet = {
            label: 'Dataset ' + (this.chart2.data.datasets.length + 1),
            backgroundColor: this.utils.transparentize(dsColor, 0.5),
            borderColor: dsColor,
            data: [datos.respuesta],
          };
          this.chart2.data.datasets.push(newDataSet);
          this.chart2.data.labels.push(datos._id);

          this.chart2.update();
          console.log(this.chart2.data.datasets);
          console.log(this.chart2.data.labels);
        });
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
