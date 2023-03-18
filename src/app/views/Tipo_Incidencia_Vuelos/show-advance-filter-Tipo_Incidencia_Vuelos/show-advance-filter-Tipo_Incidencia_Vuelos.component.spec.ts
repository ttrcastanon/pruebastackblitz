import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_Incidencia_VuelosComponent } from './show-advance-filter-Tipo_Incidencia_Vuelos.component';

describe('ShowAdvanceFilterTipo_Incidencia_VuelosComponent', () => {
  let component: ShowAdvanceFilterTipo_Incidencia_VuelosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_Incidencia_VuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_Incidencia_VuelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_Incidencia_VuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
