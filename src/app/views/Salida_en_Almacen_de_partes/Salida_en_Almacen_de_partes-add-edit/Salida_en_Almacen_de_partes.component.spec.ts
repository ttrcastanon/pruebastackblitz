import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Salida_en_Almacen_de_partesComponent } from './Salida_en_Almacen_de_partes.component';

describe('Salida_en_Almacen_de_partesComponent', () => {
  let component: Salida_en_Almacen_de_partesComponent;
  let fixture: ComponentFixture<Salida_en_Almacen_de_partesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Salida_en_Almacen_de_partesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Salida_en_Almacen_de_partesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

