import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIngreso_de_Costos_de_ServiciosComponent } from './list-Ingreso_de_Costos_de_Servicios.component';

describe('ListIngreso_de_Costos_de_ServiciosComponent', () => {
  let component: ListIngreso_de_Costos_de_ServiciosComponent;
  let fixture: ComponentFixture<ListIngreso_de_Costos_de_ServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListIngreso_de_Costos_de_ServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIngreso_de_Costos_de_ServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
