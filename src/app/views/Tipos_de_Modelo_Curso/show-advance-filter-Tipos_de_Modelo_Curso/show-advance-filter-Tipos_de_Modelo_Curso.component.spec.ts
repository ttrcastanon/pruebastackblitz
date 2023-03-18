import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipos_de_Modelo_CursoComponent } from './show-advance-filter-Tipos_de_Modelo_Curso.component';

describe('ShowAdvanceFilterTipos_de_Modelo_CursoComponent', () => {
  let component: ShowAdvanceFilterTipos_de_Modelo_CursoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipos_de_Modelo_CursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipos_de_Modelo_CursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipos_de_Modelo_CursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
