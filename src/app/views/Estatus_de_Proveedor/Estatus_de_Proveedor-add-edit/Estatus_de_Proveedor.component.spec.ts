import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_ProveedorComponent } from './Estatus_de_Proveedor.component';

describe('Estatus_de_ProveedorComponent', () => {
  let component: Estatus_de_ProveedorComponent;
  let fixture: ComponentFixture<Estatus_de_ProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_ProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_ProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

