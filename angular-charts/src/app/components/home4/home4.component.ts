import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home4',
  templateUrl: './home4.component.html',
  styleUrls: ['./home4.component.css'],
})
export class Home4Component {
  isLinear = false;

  procesoForm!: FormGroup;
  variableForm!: FormGroup;
  triggerForm!: FormGroup;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.procesoForm = this._formBuilder.group({});
    this.variableForm = this._formBuilder.group({});
    this.triggerForm = this._formBuilder.group({});
  }
}
