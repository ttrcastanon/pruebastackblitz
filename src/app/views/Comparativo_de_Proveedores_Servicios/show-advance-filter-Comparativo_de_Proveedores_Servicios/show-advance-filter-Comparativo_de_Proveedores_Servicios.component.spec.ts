import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent } from './show-advance-filter-Comparativo_de_Proveedores_Servicios.component';

describe('ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent', () => {
  let component: ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
