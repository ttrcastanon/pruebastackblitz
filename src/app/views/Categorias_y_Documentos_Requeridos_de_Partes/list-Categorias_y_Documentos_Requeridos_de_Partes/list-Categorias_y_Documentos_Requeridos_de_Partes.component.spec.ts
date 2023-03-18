import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCategorias_y_Documentos_Requeridos_de_PartesComponent } from './list-Categorias_y_Documentos_Requeridos_de_Partes.component';

describe('ListCategorias_y_Documentos_Requeridos_de_PartesComponent', () => {
  let component: ListCategorias_y_Documentos_Requeridos_de_PartesComponent;
  let fixture: ComponentFixture<ListCategorias_y_Documentos_Requeridos_de_PartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCategorias_y_Documentos_Requeridos_de_PartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCategorias_y_Documentos_Requeridos_de_PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
