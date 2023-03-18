import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_CotizacionComponent } from './Estatus_de_Cotizacion.component';

describe('Estatus_de_CotizacionComponent', () => {
  let component: Estatus_de_CotizacionComponent;
  let fixture: ComponentFixture<Estatus_de_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

