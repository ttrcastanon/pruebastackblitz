import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comparativo_de_Proveedores_ServiciosComponent } from './Comparativo_de_Proveedores_Servicios.component';

describe('Comparativo_de_Proveedores_ServiciosComponent', () => {
  let component: Comparativo_de_Proveedores_ServiciosComponent;
  let fixture: ComponentFixture<Comparativo_de_Proveedores_ServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Comparativo_de_Proveedores_ServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Comparativo_de_Proveedores_ServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

