import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCreacion_de_ClientesComponent } from './show-advance-filter-Creacion_de_Clientes.component';

describe('ShowAdvanceFilterCreacion_de_ClientesComponent', () => {
  let component: ShowAdvanceFilterCreacion_de_ClientesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCreacion_de_ClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCreacion_de_ClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCreacion_de_ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
