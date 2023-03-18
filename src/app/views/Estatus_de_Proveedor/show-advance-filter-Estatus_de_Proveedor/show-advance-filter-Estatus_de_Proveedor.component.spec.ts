import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_ProveedorComponent } from './show-advance-filter-Estatus_de_Proveedor.component';

describe('ShowAdvanceFilterEstatus_de_ProveedorComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_ProveedorComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_ProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_ProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_ProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
