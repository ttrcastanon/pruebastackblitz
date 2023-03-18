import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Equipo_de_EmergenciaComponent } from './list-Tipo_de_Equipo_de_Emergencia.component';

describe('ListTipo_de_Equipo_de_EmergenciaComponent', () => {
  let component: ListTipo_de_Equipo_de_EmergenciaComponent;
  let fixture: ComponentFixture<ListTipo_de_Equipo_de_EmergenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Equipo_de_EmergenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Equipo_de_EmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
