import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Ingreso_a_CotizacionComponent } from './Tipo_de_Ingreso_a_Cotizacion.component';

describe('Tipo_de_Ingreso_a_CotizacionComponent', () => {
  let component: Tipo_de_Ingreso_a_CotizacionComponent;
  let fixture: ComponentFixture<Tipo_de_Ingreso_a_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Ingreso_a_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Ingreso_a_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

