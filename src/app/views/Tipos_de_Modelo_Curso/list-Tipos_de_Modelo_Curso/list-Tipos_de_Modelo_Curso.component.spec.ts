import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipos_de_Modelo_CursoComponent } from './list-Tipos_de_Modelo_Curso.component';

describe('ListTipos_de_Modelo_CursoComponent', () => {
  let component: ListTipos_de_Modelo_CursoComponent;
  let fixture: ComponentFixture<ListTipos_de_Modelo_CursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipos_de_Modelo_CursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipos_de_Modelo_CursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
