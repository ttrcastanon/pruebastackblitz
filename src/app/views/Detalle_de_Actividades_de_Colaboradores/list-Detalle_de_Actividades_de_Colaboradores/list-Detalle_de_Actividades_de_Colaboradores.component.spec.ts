import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetalle_de_Actividades_de_ColaboradoresComponent } from './list-Detalle_de_Actividades_de_Colaboradores.component';

describe('ListDetalle_de_Actividades_de_ColaboradoresComponent', () => {
  let component: ListDetalle_de_Actividades_de_ColaboradoresComponent;
  let fixture: ComponentFixture<ListDetalle_de_Actividades_de_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDetalle_de_Actividades_de_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetalle_de_Actividades_de_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
