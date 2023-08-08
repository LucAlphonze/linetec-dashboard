import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css'],
})
export class Home2Component implements OnInit {
  isLinear = false;

  paisForm!: FormGroup;
  provinciaForm!: FormGroup;
  localidadForm!: FormGroup;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.paisForm = this._formBuilder.group({});
    this.provinciaForm = this._formBuilder.group({});
    this.localidadForm = this._formBuilder.group({});
  }
}
