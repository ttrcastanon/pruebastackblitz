import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Motivo_de_Edicion_de_CotizacionComponent } from './Motivo_de_Edicion_de_Cotizacion.component';

describe('Motivo_de_Edicion_de_CotizacionComponent', () => {
  let component: Motivo_de_Edicion_de_CotizacionComponent;
  let fixture: ComponentFixture<Motivo_de_Edicion_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Motivo_de_Edicion_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Motivo_de_Edicion_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

