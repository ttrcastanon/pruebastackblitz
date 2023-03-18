import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent } from './show-advance-filter-Estatus_de_Solicitud_de_Compras.component';

describe('ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_Solicitud_de_ComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
