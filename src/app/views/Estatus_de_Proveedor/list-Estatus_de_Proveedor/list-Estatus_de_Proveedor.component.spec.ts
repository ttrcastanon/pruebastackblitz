import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_ProveedorComponent } from './list-Estatus_de_Proveedor.component';

describe('ListEstatus_de_ProveedorComponent', () => {
  let component: ListEstatus_de_ProveedorComponent;
  let fixture: ComponentFixture<ListEstatus_de_ProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_ProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_ProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
