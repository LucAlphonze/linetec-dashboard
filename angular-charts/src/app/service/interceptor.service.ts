import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor(private spinnerService: SpinnerService) {}
}
