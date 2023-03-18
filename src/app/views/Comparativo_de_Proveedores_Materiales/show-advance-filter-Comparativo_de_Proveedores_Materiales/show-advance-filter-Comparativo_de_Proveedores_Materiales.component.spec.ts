import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent } from './show-advance-filter-Comparativo_de_Proveedores_Materiales.component';

describe('ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent', () => {
  let component: ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
