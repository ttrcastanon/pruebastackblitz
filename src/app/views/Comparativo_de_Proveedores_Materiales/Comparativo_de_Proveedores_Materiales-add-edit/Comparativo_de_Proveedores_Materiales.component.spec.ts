import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comparativo_de_Proveedores_MaterialesComponent } from './Comparativo_de_Proveedores_Materiales.component';

describe('Comparativo_de_Proveedores_MaterialesComponent', () => {
  let component: Comparativo_de_Proveedores_MaterialesComponent;
  let fixture: ComponentFixture<Comparativo_de_Proveedores_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Comparativo_de_Proveedores_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Comparativo_de_Proveedores_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

