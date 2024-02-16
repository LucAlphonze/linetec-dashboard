import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home5',
  templateUrl: './home5.component.html',
  styleUrls: ['./home5.component.css'],
})
export class Home5Component implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  isLinear = true;

  paisForm!: FormGroup;
  provinciaForm!: FormGroup;
  localidadForm!: FormGroup;
  empresaForm!: FormGroup;
  plantaForm!: FormGroup;
  tipoMaquinaForm!: FormGroup;
  lineaProduccionForm!: FormGroup;
  maquinaForm!: FormGroup;
  procesoForm!: FormGroup;
  triggerForm!: FormGroup;
  timeout: any;
  token: any;
  isTrue: boolean = false;

  isPaisCompleted: boolean = false;
  isProvinciaCompleted: boolean = false;
  isLocalidadCompleted: boolean = false;
  isEmpresaCompleted: boolean = false;
  isPlantaCompleted: boolean = false;
  isTipoMaquinaCompleted: boolean = false;
  isLineaProduccionCompleted: boolean = false;
  isMaquinaCompleted: boolean = false;
  isProcesoCompleted: boolean = false;
  isTriggerCompleted: boolean = false;

  subscription!: Subscription;
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private service: AuthService,
    private jwtHelper: JwtHelperService,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.expirationCheck();
    this.service.getUser();
    this.subscription = this.service.paisSelected.subscribe((message) => {
      if (message != '') {
        this.isPaisCompleted = true;
      } else {
        this.isPaisCompleted = false;
      }
    });
    this.subscription = this.service.provinciaSelected.subscribe((message) => {
      if (message != '') {
        this.isProvinciaCompleted = true;
      } else {
        this.isProvinciaCompleted = false;
      }
    });
    this.subscription = this.service.localidadSelected.subscribe((message) => {
      if (message != '') {
        this.isLocalidadCompleted = true;
      } else {
        this.isLocalidadCompleted = false;
      }
    });
    this.subscription = this.service.empresaSelected.subscribe((message) => {
      if (message != '') {
        this.isEmpresaCompleted = true;
      } else {
        this.isEmpresaCompleted = false;
      }
    });
    this.subscription = this.service.plantaSelected.subscribe((message) => {
      if (message != '') {
        this.isPlantaCompleted = true;
      } else {
        this.isPlantaCompleted = false;
      }
    });
    this.subscription = this.service.lineaSelected.subscribe((message) => {
      if (message != '') {
        this.isLineaProduccionCompleted = true;
      } else {
        this.isLineaProduccionCompleted = false;
      }
    });
    this.subscription = this.service.tipoMaquinaSelected.subscribe(
      (message) => {
        if (message != '') {
          this.isTipoMaquinaCompleted = true;
        } else {
          this.isTipoMaquinaCompleted = false;
        }
      }
    );
    this.subscription = this.service.maquinaSelected.subscribe((message) => {
      if (message != '') {
        this.isMaquinaCompleted = true;
      } else {
        this.isMaquinaCompleted = false;
      }
    });
    this.subscription = this.service.procesoSelected.subscribe((message) => {
      if (message != '') {
        this.isProcesoCompleted = true;
      } else {
        this.isProcesoCompleted = false;
      }
    });
    this.subscription = this.service.triggerSelected.subscribe((message) => {
      if (message != '') {
        this.isTriggerCompleted = true;
      } else {
        this.isTriggerCompleted = false;
      }
    });
  }

  expirationCheck(): void {
    this.token = sessionStorage.getItem('token')?.toString();
    this.timeout =
      this.jwtHelper.getTokenExpirationDate(this.token)!.valueOf() -
      new Date().valueOf();
    this.service.expirationCounter(this.timeout);
  }
}
