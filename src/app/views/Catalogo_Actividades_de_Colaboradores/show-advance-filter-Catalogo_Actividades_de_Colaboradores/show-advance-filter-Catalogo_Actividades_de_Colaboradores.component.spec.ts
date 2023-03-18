import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent } from './show-advance-filter-Catalogo_Actividades_de_Colaboradores.component';

describe('ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent', () => {
  let component: ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCatalogo_Actividades_de_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
