import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent } from './show-advance-filter-Configuracion_de_tecnicos_e_inspectores.component';

describe('ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent', () => {
  let component: ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
