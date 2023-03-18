import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent } from './show-advance-filter-Listado_de_compras_en_proceso_de_Importacion.component';

describe('ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent', () => {
  let component: ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
