import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent } from './show-advance-filter-Categorias_y_Documentos_Requeridos_de_Partes.component';

describe('ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent', () => {
  let component: ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCategorias_y_Documentos_Requeridos_de_PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
