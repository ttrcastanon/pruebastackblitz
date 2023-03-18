import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComparativo_de_Proveedores_ServiciosComponent } from './list-Comparativo_de_Proveedores_Servicios.component';

describe('ListComparativo_de_Proveedores_ServiciosComponent', () => {
  let component: ListComparativo_de_Proveedores_ServiciosComponent;
  let fixture: ComponentFixture<ListComparativo_de_Proveedores_ServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComparativo_de_Proveedores_ServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComparativo_de_Proveedores_ServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
