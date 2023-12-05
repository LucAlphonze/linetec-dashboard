import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpService } from './service/http.service';
import { Subscription, catchError } from 'rxjs';
import { RegistroFiltrado, Variable } from './models/datos.model';
import { SpinnerService } from './service/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck, OnInit {
  opened: boolean = false;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  valor!: FormGroup;
  title = 'angular-charts';
  isMenuRequired = false;
  isAdminUser = false;
  listVariables: Variable[] = [];
  subscription!: Subscription;
  subscription2!: Subscription;
  listDatos: RegistroFiltrado[] = [];
  exceedList: any = [];

  notExceedList2: any = [];

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private service: AuthService,
    private _httpService: HttpService,
    private spinnerService: SpinnerService
  ) {}
  ngOnInit(): void {
    this.valor = this.builder.group({
      threshold: new FormControl<number>(25),
    });

    this.subscription = this._httpService.listaVariables.subscribe(
      (message) => (this.listVariables = message)
    );

    this.subscription2 = this._httpService.listaDatosInRange.subscribe(
      (message) => {
        // console.log('app component datos in range: ', message);
      }
    );
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

  getFiltrados() {
    var inicio: any = this.range.value.start?.getTime().toString();
    var final: any = this.range.value.end?.getTime().toString();
    this.spinnerService.llamarSpinner('tabla');
    this.spinnerService.llamarSpinner('grafico');
    const notExceedList: any = [];
    this._httpService
      .getValoresFiltrados(this.listVariables[1]._id, inicio, final, 'max')
      .subscribe((data) => {
        // console.log(data);
        this._httpService.stream_RegistroFiltrado(data['datos']);
      });
    this._httpService
      .getValoresFiltrados2(this.listVariables[1]._id, inicio, final)
      .subscribe((data) => {
        // console.log(data);
        this._httpService.stream_RegistroFiltrado2(data['datos']);
      });
    this._httpService
      .getAllInRange(this.listVariables[1]._id, inicio, final)
      .subscribe((data) => {
        this.exceedList = data['datos'].filter((x: any) => {
          return x.valor_lectura > this.valor.value.threshold;
        });
        this.notExceedList2 = data['datos'].filter((n: any) => {
          return n.valor_lectura < this.valor.value.threshold;
        });
        console.log(
          'exceed: ',
          this.exceedList.length,
          'not exceed: ',
          this.notExceedList2.length
        );
        myBlock: for (let i = 0; i < this.exceedList.length; i++) {
          // console.log('i es ', i);
          if (i == this.exceedList.length - 1) {
            // console.log('not exceed list: ', notExceedList);
            this.exceedList.map((e: any, index: number) => {
              e.time = this.formatTime(
                new Date(
                  notExceedList[
                    index < notExceedList.length
                      ? index
                      : notExceedList.length - 1
                  ].time_stamp
                ).getTime(),
                new Date(e.time_stamp).getTime()
              );
              e.cTime_stamp = this.formatDate(
                notExceedList[
                  index < notExceedList.length
                    ? index
                    : notExceedList.length - 1
                ].time_stamp
              );
              e.time_stamp = this.formatDate(e.time_stamp);
            });
            this._httpService.stream_DatosInRange(this.exceedList);
          }
          for (let j = 0; j < this.notExceedList2.length; j++) {
            if (
              this.notExceedList2[j].valor_lectura <
                this.valor.value.threshold &&
              new Date(this.notExceedList2[j]?.time_stamp).getTime() >
                new Date(this.exceedList[i]?.time_stamp).getTime()
            ) {
              notExceedList.push(this.notExceedList2[j]);
              continue myBlock;
            }
          }
          if (i == this.exceedList.length) {
            // console.log('not exceed list: ', notExceedList);
            this.exceedList.map((e: any, index: number) => {
              e.time = this.formatTime(
                new Date(
                  notExceedList[
                    index < notExceedList.length
                      ? index
                      : notExceedList.length - 1
                  ].time_stamp
                ).getTime(),
                new Date(e.time_stamp).getTime()
              );
              e.cTime_stamp =
                notExceedList[
                  index < notExceedList.length
                    ? index
                    : notExceedList.length - 1
                ].time_stamp;
            });
            this._httpService.stream_DatosInRange(this.exceedList);
          }
        }
      });
    this._httpService
      .getValoresFiltrados2(this.listVariables[4]._id, inicio, final)
      .subscribe((data) => {
        console.log(data);
        this._httpService.stream_Datos3(data['datos']);
      });

    this.opened = false;
  }

  formatTime(notExceed: number, exceed: number) {
    var seconds = (notExceed - exceed) / 1000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}H ${formattedMinutes}M ${formattedSeconds}S`;
  }
  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(data: string) {
    const date = new Date(data);
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
}
