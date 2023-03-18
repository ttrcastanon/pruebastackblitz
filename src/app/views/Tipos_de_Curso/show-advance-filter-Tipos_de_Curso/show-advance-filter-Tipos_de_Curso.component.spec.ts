import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipos_de_CursoComponent } from './show-advance-filter-Tipos_de_Curso.component';

describe('ShowAdvanceFilterTipos_de_CursoComponent', () => {
  let component: ShowAdvanceFilterTipos_de_CursoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipos_de_CursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipos_de_CursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipos_de_CursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
