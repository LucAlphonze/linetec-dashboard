import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpService } from './service/http.service';
import { Subscription, catchError } from 'rxjs';
import { RegistroFiltrado, Variable } from './models/datos.model';
import { SpinnerService } from './service/spinner.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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
  subscription!: Subscription;
  subscription2!: Subscription;
  subscription3!: Subscription;
  listDatos: RegistroFiltrado[] = [];
  exceedList: any = [];

  notExceedList2: any = [];
  fullName!: string;
  iniciales!: string;
  mobile = false;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private service: AuthService,
    private _httpService: HttpService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
    this.valor = this.builder.group({
      threshold: new FormControl<number>(25),
    });
    this.range = this.builder.group({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      granularidad: new FormControl<string>('day'),
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

    this.subscription2 = this._httpService.listaDatosInRange.subscribe(
      (message) => {
        // console.log('app component datos in range: ', message);
      }
    );

    if (window.screen.width < 500) {
      this.mobile = true;
    }
  }

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
}
