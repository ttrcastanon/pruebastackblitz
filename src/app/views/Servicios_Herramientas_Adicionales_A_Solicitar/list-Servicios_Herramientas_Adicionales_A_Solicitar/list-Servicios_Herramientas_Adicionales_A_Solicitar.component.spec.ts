import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServicios_Herramientas_Adicionales_A_SolicitarComponent } from './list-Servicios_Herramientas_Adicionales_A_Solicitar.component';

describe('ListServicios_Herramientas_Adicionales_A_SolicitarComponent', () => {
  let component: ListServicios_Herramientas_Adicionales_A_SolicitarComponent;
  let fixture: ComponentFixture<ListServicios_Herramientas_Adicionales_A_SolicitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListServicios_Herramientas_Adicionales_A_SolicitarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServicios_Herramientas_Adicionales_A_SolicitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
