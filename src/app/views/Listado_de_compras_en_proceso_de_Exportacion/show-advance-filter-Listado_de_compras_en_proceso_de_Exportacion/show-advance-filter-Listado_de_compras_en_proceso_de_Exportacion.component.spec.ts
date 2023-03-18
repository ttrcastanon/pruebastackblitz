import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent } from './show-advance-filter-Listado_de_compras_en_proceso_de_Exportacion.component';

describe('ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent', () => {
  let component: ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_de_compras_en_proceso_de_ExportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
