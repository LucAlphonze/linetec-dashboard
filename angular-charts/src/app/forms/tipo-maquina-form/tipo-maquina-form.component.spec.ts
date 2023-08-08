import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMaquinaFormComponent } from './tipo-maquina-form.component';

describe('TipoMaquinaFormComponent', () => {
  let component: TipoMaquinaFormComponent;
  let fixture: ComponentFixture<TipoMaquinaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoMaquinaFormComponent]
    });
    fixture = TestBed.createComponent(TipoMaquinaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
