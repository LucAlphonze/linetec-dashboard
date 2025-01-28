import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpService } from './service/http.service';
import { Subscription, catchError } from 'rxjs';
import { Dato, RegistroFiltrado, Variable } from './models/datos.model';
import { SpinnerService } from './service/spinner.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UtilsService } from './service/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck, OnInit {
  opened: boolean = false;
  range!: FormGroup;
  valor!: FormGroup;
  title = 'angular-charts';
  isMenuRequired = false;
  isAdminUser = false;
  listVariables: any = [];
  chartList: any = [];
  subscription!: Subscription;
  subscription2!: Subscription;
  subscription3!: Subscription;
  tipoChart!: FormGroup;
  created_chart_List: any = [];
  fullName!: string;
  iniciales!: string;
  dato!: Dato;
  chartForm!: FormGroup;
  fields: any = [];

  chartUrl: string = environment.API_URL_CHARTS;

  charts: any[] = [
    { value: 'bar', viewValue: 'Barra' },
    { value: 'line', viewValue: 'Linea' },
  ];
  mobile = false;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private service: AuthService,
    private _httpService: HttpService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private utils: UtilsService
  ) {
    this.matIconRegistry.addSvgIcon(
      'ajustes-deslizadores',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/ajustes-deslizadores.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'calendario',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/calendario 2.svg'
      )
    );
  }
  ngOnInit(): void {
    this.getCharts();
    // this.valor = this.builder.group({
    //   threshold: new FormControl<number>(25),
    // });
    // this.range = this.builder.group({
    //   start: new FormControl<Date | null>(null),
    //   end: new FormControl<Date | null>(null),
    //   granularidad: new FormControl<string>('day'),
    // });
    this.tipoChart = this.builder.group({
      tipo: new FormControl<string>(''),
      titulo: new FormControl<string>(''),
      variable: new FormControl<Number>(0),
    });
    this.subscription3 = this.service.fullname.subscribe((message) => {
      setTimeout(() => {
        console.log('fullname: ', message);
        this.fullName = message;
        this.iniciales = this.splitFullName();
      }, 0);
    });
    this.subscription = this._httpService.listaVariables.subscribe(
      (message: any) => (this.listVariables = message)
    );
    // this.subscription2 = this._httpService.listChartDataInfo.subscribe(
    //   (data) => {
    //     this.created_chart_List.push(data);
    //   }
    // );
    this.subscription2 = this._httpService.listaDatosInRange.subscribe(
      (message) => {
        // console.log('app component datos in range: ', message);
      }
    );

    if (window.screen.width < 500) {
      this.mobile = true;
    }
  }
  decimation: any = {
    id: 'decimation',
    enabled: true,
    algorithm: 'lttb',
    samples: 5000,
    threshold: 1000,
  };
  ngDoCheck(): void {
    let currentUrl = this.router.url;
    if (currentUrl == '/login' || currentUrl == '/register') {
      this.isMenuRequired = false;
      this.opened = false;
    } else {
      this.isMenuRequired = true;
    }
    if (this.service.getUserRole() === 'admin') {
      this.isAdminUser = true;
    } else {
      this.isAdminUser = false;
    }
  }
  logOut() {
    this.service.logout();
  }

  splitFullName() {
    var output = this.fullName.split(' ');
    var iniciales = '';
    if (output.length > 1) {
      iniciales = output[0].charAt(0) + output[1].charAt(0);
    } else {
      iniciales = output[0].charAt(0) + output[0].charAt(1);
    }
    console.log('iniciales: ', iniciales);
    return iniciales.toUpperCase();
  }

  poblarChartArray() {
    const createdChartItem = {
      nombre: this.tipoChart.value.titulo,
      variables: this.tipoChart.value.variable,
      tipo: this.tipoChart.value.tipo,
    };
    this._httpService.stream_Chart_Info(createdChartItem);
  }
  getCharts() {
    this._httpService
      .httpGet(environment.API_URL_CHARTS)
      .subscribe((data: any) => {
        console.log('app component chartlist: ', data['datos']);
        this.chartList = data['datos'];
        this.buildForm();
      });
  }
  logOptions(value: any) {
    console.log('log options', value);
  }

  getFormControlsFields() {
    const formGroupFields: any = {};
    for (const chart of this.chartList) {
      formGroupFields[chart.nombre] = new FormControl(null);

      this.fields.push(chart);
    }
    return formGroupFields;
  }
  buildForm() {
    const formGroupFields = this.getFormControlsFields();
    this.chartForm = new FormGroup(formGroupFields);
    console.log('form group fields', formGroupFields);
    console.log('chartForm controls', this.chartForm);
  }
  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.nombre === o2.nombre : o2 === o2;
  }
  updateVariables(chart: any) {
    console.log('update variables chart: ', chart);
    console.log('chartlist: ', this.chartList);
    this._httpService.stream_Chart_Info(chart);
  }
}
