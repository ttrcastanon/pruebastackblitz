import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCategorias_y_Documentos_RequeridosComponent } from './list-Categorias_y_Documentos_Requeridos.component';

describe('ListCategorias_y_Documentos_RequeridosComponent', () => {
  let component: ListCategorias_y_Documentos_RequeridosComponent;
  let fixture: ComponentFixture<ListCategorias_y_Documentos_RequeridosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCategorias_y_Documentos_RequeridosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCategorias_y_Documentos_RequeridosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
