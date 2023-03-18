import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMotivo_de_Edicion_de_CotizacionComponent } from './list-Motivo_de_Edicion_de_Cotizacion.component';

describe('ListMotivo_de_Edicion_de_CotizacionComponent', () => {
  let component: ListMotivo_de_Edicion_de_CotizacionComponent;
  let fixture: ComponentFixture<ListMotivo_de_Edicion_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMotivo_de_Edicion_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMotivo_de_Edicion_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
