import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent } from './show-advance-filter-Clasificacion_de_aeronavegabilidad.component';

describe('ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent', () => {
  let component: ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterClasificacion_de_aeronavegabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
