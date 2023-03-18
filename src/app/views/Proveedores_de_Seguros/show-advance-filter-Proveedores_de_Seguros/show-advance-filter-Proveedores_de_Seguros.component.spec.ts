import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterProveedores_de_SegurosComponent } from './show-advance-filter-Proveedores_de_Seguros.component';

describe('ShowAdvanceFilterProveedores_de_SegurosComponent', () => {
  let component: ShowAdvanceFilterProveedores_de_SegurosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterProveedores_de_SegurosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterProveedores_de_SegurosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterProveedores_de_SegurosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
