import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_de_compras_en_proceso_de_ExportacionComponent } from './Listado_de_compras_en_proceso_de_Exportacion.component';

describe('Listado_de_compras_en_proceso_de_ExportacionComponent', () => {
  let component: Listado_de_compras_en_proceso_de_ExportacionComponent;
  let fixture: ComponentFixture<Listado_de_compras_en_proceso_de_ExportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_de_compras_en_proceso_de_ExportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_de_compras_en_proceso_de_ExportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

