import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Concepto_Balance_GeneralComponent } from './list-Tipo_de_Concepto_Balance_General.component';

describe('ListTipo_de_Concepto_Balance_GeneralComponent', () => {
  let component: ListTipo_de_Concepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<ListTipo_de_Concepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Concepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Concepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
