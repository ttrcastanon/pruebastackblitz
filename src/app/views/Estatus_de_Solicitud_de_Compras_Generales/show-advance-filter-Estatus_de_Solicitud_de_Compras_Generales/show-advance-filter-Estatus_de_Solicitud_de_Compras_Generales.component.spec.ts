import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent } from './show-advance-filter-Estatus_de_Solicitud_de_Compras_Generales.component';

describe('ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_Solicitud_de_Compras_GeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
