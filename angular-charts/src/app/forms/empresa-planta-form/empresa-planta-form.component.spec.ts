import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaPlantaFormComponent } from './empresa-planta-form.component';

describe('EmpresaPlantaFormComponent', () => {
  let component: EmpresaPlantaFormComponent;
  let fixture: ComponentFixture<EmpresaPlantaFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaPlantaFormComponent]
    });
    fixture = TestBed.createComponent(EmpresaPlantaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
