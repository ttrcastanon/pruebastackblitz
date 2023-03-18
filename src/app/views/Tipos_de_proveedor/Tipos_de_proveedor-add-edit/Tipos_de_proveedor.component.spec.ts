import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipos_de_proveedorComponent } from './Tipos_de_proveedor.component';

describe('Tipos_de_proveedorComponent', () => {
  let component: Tipos_de_proveedorComponent;
  let fixture: ComponentFixture<Tipos_de_proveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipos_de_proveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipos_de_proveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

