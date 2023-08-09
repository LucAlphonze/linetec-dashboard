import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableFormComponent } from './variable-form.component';

describe('VariableFormComponent', () => {
  let component: VariableFormComponent;
  let fixture: ComponentFixture<VariableFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariableFormComponent]
    });
    fixture = TestBed.createComponent(VariableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
