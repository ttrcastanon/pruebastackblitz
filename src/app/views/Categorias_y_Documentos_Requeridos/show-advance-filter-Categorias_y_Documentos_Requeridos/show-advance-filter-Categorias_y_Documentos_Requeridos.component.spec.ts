import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent } from './show-advance-filter-Categorias_y_Documentos_Requeridos.component';

describe('ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent', () => {
  let component: ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCategorias_y_Documentos_RequeridosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
