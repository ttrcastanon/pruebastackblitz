import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent } from './show-advance-filter-Tipo_de_Solicitud_de_Compras.component';

describe('ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Solicitud_de_ComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
