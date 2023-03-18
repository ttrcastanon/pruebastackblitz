import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPre_Solicitud_de_CotizacionComponent } from './list-Pre_Solicitud_de_Cotizacion.component';

describe('ListPre_Solicitud_de_CotizacionComponent', () => {
  let component: ListPre_Solicitud_de_CotizacionComponent;
  let fixture: ComponentFixture<ListPre_Solicitud_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPre_Solicitud_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPre_Solicitud_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
