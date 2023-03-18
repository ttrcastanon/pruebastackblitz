import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListListado_de_Vuelo_a_FacturarComponent } from './list-Listado_de_Vuelo_a_Facturar.component';

describe('ListListado_de_Vuelo_a_FacturarComponent', () => {
  let component: ListListado_de_Vuelo_a_FacturarComponent;
  let fixture: ComponentFixture<ListListado_de_Vuelo_a_FacturarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListListado_de_Vuelo_a_FacturarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListListado_de_Vuelo_a_FacturarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
