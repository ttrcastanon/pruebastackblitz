import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProveedores_de_SegurosComponent } from './list-Proveedores_de_Seguros.component';

describe('ListProveedores_de_SegurosComponent', () => {
  let component: ListProveedores_de_SegurosComponent;
  let fixture: ComponentFixture<ListProveedores_de_SegurosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProveedores_de_SegurosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProveedores_de_SegurosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
