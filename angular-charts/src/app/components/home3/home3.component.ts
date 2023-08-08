import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home3',
  templateUrl: './home3.component.html',
  styleUrls: ['./home3.component.css'],
})
export class Home3Component {
  isLinear = false;

  tipoMaquinaForm!: FormGroup;
  maquinaForm!: FormGroup;
  lineaForm!: FormGroup;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.tipoMaquinaForm = this._formBuilder.group({});
    this.maquinaForm = this._formBuilder.group({});
    this.lineaForm = this._formBuilder.group({});
  }
}
