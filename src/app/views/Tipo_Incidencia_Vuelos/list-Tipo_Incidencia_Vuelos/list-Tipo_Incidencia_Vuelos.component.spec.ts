import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_Incidencia_VuelosComponent } from './list-Tipo_Incidencia_Vuelos.component';

describe('ListTipo_Incidencia_VuelosComponent', () => {
  let component: ListTipo_Incidencia_VuelosComponent;
  let fixture: ComponentFixture<ListTipo_Incidencia_VuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_Incidencia_VuelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_Incidencia_VuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
