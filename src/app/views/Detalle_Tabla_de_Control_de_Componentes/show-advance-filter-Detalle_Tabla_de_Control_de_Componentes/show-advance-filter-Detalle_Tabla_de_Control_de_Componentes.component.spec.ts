import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent } from './show-advance-filter-Detalle_Tabla_de_Control_de_Componentes.component';

describe('ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent', () => {
  let component: ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
