import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgrupacion_Concepto_Balance_GeneralComponent } from './list-Agrupacion_Concepto_Balance_General.component';

describe('ListAgrupacion_Concepto_Balance_GeneralComponent', () => {
  let component: ListAgrupacion_Concepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<ListAgrupacion_Concepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAgrupacion_Concepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAgrupacion_Concepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
