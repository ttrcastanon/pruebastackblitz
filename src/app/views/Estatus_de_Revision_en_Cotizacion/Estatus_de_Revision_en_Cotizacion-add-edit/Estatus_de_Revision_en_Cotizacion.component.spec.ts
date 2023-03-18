import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_Revision_en_CotizacionComponent } from './Estatus_de_Revision_en_Cotizacion.component';

describe('Estatus_de_Revision_en_CotizacionComponent', () => {
  let component: Estatus_de_Revision_en_CotizacionComponent;
  let fixture: ComponentFixture<Estatus_de_Revision_en_CotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_Revision_en_CotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_Revision_en_CotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

