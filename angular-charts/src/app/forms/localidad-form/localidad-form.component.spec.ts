import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalidadFormComponent } from './localidad-form.component';

describe('LocalidadFormComponent', () => {
  let component: LocalidadFormComponent;
  let fixture: ComponentFixture<LocalidadFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalidadFormComponent]
    });
    fixture = TestBed.createComponent(LocalidadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
