import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_de_compras_en_proceso_de_ImportacionComponent } from './Listado_de_compras_en_proceso_de_Importacion.component';

describe('Listado_de_compras_en_proceso_de_ImportacionComponent', () => {
  let component: Listado_de_compras_en_proceso_de_ImportacionComponent;
  let fixture: ComponentFixture<Listado_de_compras_en_proceso_de_ImportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_de_compras_en_proceso_de_ImportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_de_compras_en_proceso_de_ImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

