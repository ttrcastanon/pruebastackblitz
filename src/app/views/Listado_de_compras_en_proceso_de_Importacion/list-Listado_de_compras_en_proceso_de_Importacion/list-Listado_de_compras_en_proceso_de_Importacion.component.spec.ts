import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_de_compras_en_proceso_de_ImportacionComponent } from './list-Listado_de_compras_en_proceso_de_Importacion.component';

describe('ListListado_de_compras_en_proceso_de_ImportacionComponent', () => {
  let component: ListListado_de_compras_en_proceso_de_ImportacionComponent;
  let fixture: ComponentFixture<ListListado_de_compras_en_proceso_de_ImportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_de_compras_en_proceso_de_ImportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_de_compras_en_proceso_de_ImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
