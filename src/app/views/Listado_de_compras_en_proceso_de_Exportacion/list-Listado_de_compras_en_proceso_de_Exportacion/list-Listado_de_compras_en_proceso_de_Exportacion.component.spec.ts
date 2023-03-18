import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_de_compras_en_proceso_de_ExportacionComponent } from './list-Listado_de_compras_en_proceso_de_Exportacion.component';

describe('ListListado_de_compras_en_proceso_de_ExportacionComponent', () => {
  let component: ListListado_de_compras_en_proceso_de_ExportacionComponent;
  let fixture: ComponentFixture<ListListado_de_compras_en_proceso_de_ExportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_de_compras_en_proceso_de_ExportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_de_compras_en_proceso_de_ExportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
