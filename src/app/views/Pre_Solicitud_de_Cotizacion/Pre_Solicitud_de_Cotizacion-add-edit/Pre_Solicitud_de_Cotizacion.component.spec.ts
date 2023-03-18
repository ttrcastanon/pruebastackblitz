import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pre_Solicitud_de_CotizacionComponent } from './Pre_Solicitud_de_Cotizacion.component';

describe('Pre_Solicitud_de_CotizacionComponent', () => {
  let component: Pre_Solicitud_de_CotizacionComponent;
  let fixture: ComponentFixture<Pre_Solicitud_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Pre_Solicitud_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Pre_Solicitud_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

