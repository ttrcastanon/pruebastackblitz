import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent } from './show-advance-filter-Impresion_de_Bitacora_de_Vuelo.component';

describe('ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent', () => {
  let component: ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
