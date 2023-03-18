import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_Solicitud_de_ComprasComponent } from './Estatus_de_Solicitud_de_Compras.component';

describe('Estatus_de_Solicitud_de_ComprasComponent', () => {
  let component: Estatus_de_Solicitud_de_ComprasComponent;
  let fixture: ComponentFixture<Estatus_de_Solicitud_de_ComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_Solicitud_de_ComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_Solicitud_de_ComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

