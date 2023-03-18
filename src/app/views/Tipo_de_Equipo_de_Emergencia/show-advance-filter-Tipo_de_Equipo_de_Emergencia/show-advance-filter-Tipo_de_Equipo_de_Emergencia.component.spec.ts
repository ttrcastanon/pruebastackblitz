import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent } from './show-advance-filter-Tipo_de_Equipo_de_Emergencia.component';

describe('ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Equipo_de_EmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
