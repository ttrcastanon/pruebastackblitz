import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalogo_Actividades_de_ColaboradoresComponent } from './list-Catalogo_Actividades_de_Colaboradores.component';

describe('ListCatalogo_Actividades_de_ColaboradoresComponent', () => {
  let component: ListCatalogo_Actividades_de_ColaboradoresComponent;
  let fixture: ComponentFixture<ListCatalogo_Actividades_de_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCatalogo_Actividades_de_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalogo_Actividades_de_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
