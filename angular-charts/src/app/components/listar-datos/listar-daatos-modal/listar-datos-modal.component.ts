import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-listar-datos-modal',
  templateUrl: './listar-datos-modal.component.html',
  styleUrls: ['./listar-datos-modal.component.css'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    NgFor,
  ],
})
export class ListarDatosModal implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ListarDatosModal>,
    private service: HttpService
  ) {}
  subscription!: Subscription;
  listVariables: any;

  ngOnInit(): void {
    this.service.getVariables().subscribe((data) => {
      this.listVariables = data.filter(
        (x: any) =>
          x.id_trigger.nombre !== 'sin-filtro' &&
          x.id_trigger.nombre !== 'cambio-tiempo'
      );
    });
  }
}
