import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Respuesta_del_Cliente_a_CotizacionComponent } from './Respuesta_del_Cliente_a_Cotizacion.component';

describe('Respuesta_del_Cliente_a_CotizacionComponent', () => {
  let component: Respuesta_del_Cliente_a_CotizacionComponent;
  let fixture: ComponentFixture<Respuesta_del_Cliente_a_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Respuesta_del_Cliente_a_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Respuesta_del_Cliente_a_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

