import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterResponsable_Incidencia_VueloComponent } from './show-advance-filter-Responsable_Incidencia_Vuelo.component';

describe('ShowAdvanceFilterResponsable_Incidencia_VueloComponent', () => {
  let component: ShowAdvanceFilterResponsable_Incidencia_VueloComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterResponsable_Incidencia_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterResponsable_Incidencia_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterResponsable_Incidencia_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
