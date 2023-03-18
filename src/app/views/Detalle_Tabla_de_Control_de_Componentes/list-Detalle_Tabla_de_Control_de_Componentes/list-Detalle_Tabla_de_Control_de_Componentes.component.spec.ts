import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetalle_Tabla_de_Control_de_ComponentesComponent } from './list-Detalle_Tabla_de_Control_de_Componentes.component';

describe('ListDetalle_Tabla_de_Control_de_ComponentesComponent', () => {
  let component: ListDetalle_Tabla_de_Control_de_ComponentesComponent;
  let fixture: ComponentFixture<ListDetalle_Tabla_de_Control_de_ComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDetalle_Tabla_de_Control_de_ComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetalle_Tabla_de_Control_de_ComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
