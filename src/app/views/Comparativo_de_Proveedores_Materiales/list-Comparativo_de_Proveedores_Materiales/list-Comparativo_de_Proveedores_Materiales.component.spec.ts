import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComparativo_de_Proveedores_MaterialesComponent } from './list-Comparativo_de_Proveedores_Materiales.component';

describe('ListComparativo_de_Proveedores_MaterialesComponent', () => {
  let component: ListComparativo_de_Proveedores_MaterialesComponent;
  let fixture: ComponentFixture<ListComparativo_de_Proveedores_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComparativo_de_Proveedores_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComparativo_de_Proveedores_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
