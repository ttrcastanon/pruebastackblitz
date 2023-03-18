import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_Solicitud_de_Compras_GeneralesComponent } from './Estatus_de_Solicitud_de_Compras_Generales.component';

describe('Estatus_de_Solicitud_de_Compras_GeneralesComponent', () => {
  let component: Estatus_de_Solicitud_de_Compras_GeneralesComponent;
  let fixture: ComponentFixture<Estatus_de_Solicitud_de_Compras_GeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_Solicitud_de_Compras_GeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_Solicitud_de_Compras_GeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

