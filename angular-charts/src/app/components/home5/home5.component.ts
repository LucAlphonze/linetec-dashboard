import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-home5',
  templateUrl: './home5.component.html',
  styleUrls: ['./home5.component.css'],
})
export class Home5Component implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(MatTabGroup) tabgroup!: MatTabGroup;
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
  completed: boolean = false;
  tituloTabs = [
    'Direccion',
    'Empresa',
    'Empresa/Planta',
    'Línea de producción',
    'Tipo de Máquina',
    'Máquina',
    'Proceso',
    'Trigger',
    'Variables',
  ];
  public selected = new FormControl(0);

  constructor(
    private service: AuthService,
    private jwtHelper: JwtHelperService,
    breakpointObserver: BreakpointObserver
  ) {}
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
        this.completed = this.isLocalidadCompleted;
      } else {
        this.isLocalidadCompleted = false;
        this.completed = this.isLocalidadCompleted;
      }
    });
    this.subscription = this.service.empresaSelected.subscribe((message) => {
      if (message != '') {
        this.isEmpresaCompleted = true;
        this.completed = this.isEmpresaCompleted;
      } else {
        this.isEmpresaCompleted = false;
        this.completed = this.isEmpresaCompleted;
      }
    });
    this.subscription = this.service.plantaSelected.subscribe((message) => {
      if (message != '') {
        this.isPlantaCompleted = true;
        this.completed = this.isPlantaCompleted;
      } else {
        this.isPlantaCompleted = false;
        this.completed = this.isPlantaCompleted;
      }
    });
    this.subscription = this.service.lineaSelected.subscribe((message) => {
      if (message != '') {
        this.isLineaProduccionCompleted = true;
        this.completed = this.isPlantaCompleted;
      } else {
        this.isLineaProduccionCompleted = false;
        this.completed = this.isLocalidadCompleted;
      }
    });
    this.subscription = this.service.tipoMaquinaSelected.subscribe(
      (message) => {
        if (message != '') {
          this.isTipoMaquinaCompleted = true;
          this.completed = this.isTipoMaquinaCompleted;
        } else {
          this.isTipoMaquinaCompleted = false;
          this.completed = this.isTipoMaquinaCompleted;
        }
      }
    );
    this.subscription = this.service.maquinaSelected.subscribe((message) => {
      if (message != '') {
        this.isMaquinaCompleted = true;
        this.completed = this.isMaquinaCompleted;
      } else {
        this.isMaquinaCompleted = false;
        this.completed = this.isMaquinaCompleted;
      }
    });
    this.subscription = this.service.procesoSelected.subscribe((message) => {
      if (message != '') {
        this.isProcesoCompleted = true;
        this.completed = this.isProcesoCompleted;
      } else {
        this.isProcesoCompleted = false;
        this.completed = this.isProcesoCompleted;
      }
    });
    this.subscription = this.service.triggerSelected.subscribe((message) => {
      if (message != '') {
        this.isTriggerCompleted = true;
        this.completed = this.isTriggerCompleted;
      } else {
        this.isTriggerCompleted = false;
        this.completed = this.isTriggerCompleted;
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
  nextButton() {
    this.selected.setValue(this.selected.value! + 1);
    console.log(this.selected.value);
    this.completed = false;
  }
  backButton() {
    this.selected.setValue(this.selected.value! - 1);
    console.log(this.selected.value);
  }
}
