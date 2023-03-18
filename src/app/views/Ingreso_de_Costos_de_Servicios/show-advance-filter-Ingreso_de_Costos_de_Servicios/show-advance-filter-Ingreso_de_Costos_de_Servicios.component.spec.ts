import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent } from './show-advance-filter-Ingreso_de_Costos_de_Servicios.component';

describe('ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent', () => {
  let component: ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
