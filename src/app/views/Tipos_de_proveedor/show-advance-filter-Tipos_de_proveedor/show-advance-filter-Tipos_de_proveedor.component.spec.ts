import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipos_de_proveedorComponent } from './show-advance-filter-Tipos_de_proveedor.component';

describe('ShowAdvanceFilterTipos_de_proveedorComponent', () => {
  let component: ShowAdvanceFilterTipos_de_proveedorComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipos_de_proveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipos_de_proveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipos_de_proveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
