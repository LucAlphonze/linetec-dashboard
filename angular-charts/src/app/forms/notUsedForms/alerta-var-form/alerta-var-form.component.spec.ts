import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaVarFormComponent } from './alerta-var-form.component';

describe('AlertaVarFormComponent', () => {
  let component: AlertaVarFormComponent;
  let fixture: ComponentFixture<AlertaVarFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertaVarFormComponent]
    });
    fixture = TestBed.createComponent(AlertaVarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
