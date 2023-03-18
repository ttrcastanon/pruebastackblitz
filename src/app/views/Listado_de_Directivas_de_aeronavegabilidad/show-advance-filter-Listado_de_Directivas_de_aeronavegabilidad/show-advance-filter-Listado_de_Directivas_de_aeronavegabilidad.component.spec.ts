import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent } from './show-advance-filter-Listado_de_Directivas_de_aeronavegabilidad.component';

describe('ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent', () => {
  let component: ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
