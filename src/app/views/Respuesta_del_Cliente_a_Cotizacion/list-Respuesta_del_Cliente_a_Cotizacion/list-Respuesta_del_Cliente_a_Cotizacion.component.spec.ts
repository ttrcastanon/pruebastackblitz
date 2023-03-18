import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRespuesta_del_Cliente_a_CotizacionComponent } from './list-Respuesta_del_Cliente_a_Cotizacion.component';

describe('ListRespuesta_del_Cliente_a_CotizacionComponent', () => {
  let component: ListRespuesta_del_Cliente_a_CotizacionComponent;
  let fixture: ComponentFixture<ListRespuesta_del_Cliente_a_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRespuesta_del_Cliente_a_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRespuesta_del_Cliente_a_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
