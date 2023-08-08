import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isLinear = false;

  empresaForm!: FormGroup;
  plantaForm!: FormGroup;
  lineaForm!: FormGroup;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.empresaForm = this._formBuilder.group({});
    this.plantaForm = this._formBuilder.group({});
    this.lineaForm = this._formBuilder.group({});
  }
}
