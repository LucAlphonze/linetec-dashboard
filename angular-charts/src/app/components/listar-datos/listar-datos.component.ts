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
  listVariables: any[] = [];
  listCheckbox: any[] = [];
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
    this.getVariables();
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
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

  getRegistros(value: any) {
    this.chart.data.datasets.forEach((array: any) => {
      array.data = [];
    });
    console.log(value);
    for (let i = 0; i < this.listCheckbox.length; i++) {
      this._httpService
        .getValores(this.listCheckbox[i]._id)
        .subscribe((data) => {
          this.listDatos = data['datos'];
          console.log('datos: ', this.listDatos);
          for (let j = 0; j < this.chart.data.datasets.length; j++) {
            if (
              this.listCheckbox[i].nombre == this.chart.data.datasets[j].label
            ) {
              console.log(
                'IF TRUE',
                'check box nombre: ',
                this.listCheckbox[i].nombre,
                'en la posicion i:',
                i,
                'variable nombre: ',
                this.chart.data.datasets[j],
                'en la posicion: ',
                j
              );
              this.chart.data.labels = this.listDatos.map(
                (x) => x.fecha_lectura
              );
              console.log('despues del for each', this.chart.data.labels);
              this.chart.data.datasets[j].data = this.listDatos.map(
                (x) => x.valor_lectura
              );
            } else {
              console.log(
                'ELSE',
                'check box nombre: ',
                this.listCheckbox[i].nombre,
                'en la posicion i:',
                i,
                'variable nombre: ',
                this.chart.data.datasets[j],
                'en la posicion: ',
                j
              );
            }
            if (j == this.chart.data.datasets.length) {
              j = 0;
            }
          }
          this.chart.update();
        });
      console.log(this.chart.data.datasets[i].data);
    }
    console.log('data label', this.chart.data.datasets);
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

      for (let i = 0; i < this.listVariables.length; i++) {
        this.chart.data.datasets[i] = {
          data: [],
          label: [this.listVariables[i].nombre],
          fill: false,
          borderColor: 'rgb(255, 0, 0)',
          tension: 0.1,
        };
      }
    });
  }
}
