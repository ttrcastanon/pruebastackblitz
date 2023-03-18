import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent } from './show-advance-filter-Listado_de_Vuelo_a_Facturar.component';

describe('ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent', () => {
  let component: ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
