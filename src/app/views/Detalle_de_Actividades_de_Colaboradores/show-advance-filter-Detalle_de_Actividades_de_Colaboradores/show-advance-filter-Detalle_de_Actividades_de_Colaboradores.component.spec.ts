import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent } from './show-advance-filter-Detalle_de_Actividades_de_Colaboradores.component';

describe('ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent', () => {
  let component: ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
