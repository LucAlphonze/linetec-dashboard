import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trigger-form',
  templateUrl: './trigger-form.component.html',
  styleUrls: ['./trigger-form.component.css'],
})
export class TriggerFormComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}

  apiTrigger = environment.API_URL_TRIGGER;
  triggerForm!: FormGroup;
  listTriggers: any;

  ngOnInit(): void {
    this.GetAllTriggers();
    this.triggerForm = this._formBuilder.group({
      nombre: this._formBuilder.control('', Validators.required),
      descripcion: this._formBuilder.control('', Validators.required),
    });
  }

  GetAllTriggers() {
    this.service.getForm(this.apiTrigger).subscribe((res: any) => {
      console.log(res);
      this.listTriggers = res;
    });
  }

  crearTrigger() {
    if (this.triggerForm.valid) {
      console.log(this.triggerForm.value);
      this.service.postForm(this.apiTrigger, this.triggerForm.value).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Trigger registrado correctamente');
          }
        },
        error: (error: any) => {
          this.toastr.error(error);
          console.log(error);
        },
      });
    } else {
      this.toastr.warning('Por favor entre datos validos');
    }
  }

  borrarTrigger(id: string) {
    console.log(this.apiTrigger + id);
    this.service.deleteForm(this.apiTrigger, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Trigger borrado correctamente');
          this.GetAllTriggers();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  setTrigger(id: any, nombre: any) {
    console.log('set tipo', id, 'nombre', nombre);
    this.service.changeMessage(id);
  }

  StreamTriggerSelected(trigger_id: string) {
    this.service.streamTriggerSelected(trigger_id);
  }
}
