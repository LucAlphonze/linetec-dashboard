import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionMonitoreoFormComponent } from './administracion-monitoreo-form.component';

describe('AdministracionMonitoreoFormComponent', () => {
  let component: AdministracionMonitoreoFormComponent;
  let fixture: ComponentFixture<AdministracionMonitoreoFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracionMonitoreoFormComponent]
    });
    fixture = TestBed.createComponent(AdministracionMonitoreoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
