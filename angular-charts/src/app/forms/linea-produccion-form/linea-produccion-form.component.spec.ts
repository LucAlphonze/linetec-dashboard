import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaProduccionFormComponent } from './linea-produccion-form.component';

describe('LineaProduccionFormComponent', () => {
  let component: LineaProduccionFormComponent;
  let fixture: ComponentFixture<LineaProduccionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineaProduccionFormComponent]
    });
    fixture = TestBed.createComponent(LineaProduccionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
