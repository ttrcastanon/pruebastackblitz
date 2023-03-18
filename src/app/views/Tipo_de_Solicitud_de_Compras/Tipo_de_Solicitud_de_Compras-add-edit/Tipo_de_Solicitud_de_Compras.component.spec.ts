import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Solicitud_de_ComprasComponent } from './Tipo_de_Solicitud_de_Compras.component';

describe('Tipo_de_Solicitud_de_ComprasComponent', () => {
  let component: Tipo_de_Solicitud_de_ComprasComponent;
  let fixture: ComponentFixture<Tipo_de_Solicitud_de_ComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Solicitud_de_ComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Solicitud_de_ComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

