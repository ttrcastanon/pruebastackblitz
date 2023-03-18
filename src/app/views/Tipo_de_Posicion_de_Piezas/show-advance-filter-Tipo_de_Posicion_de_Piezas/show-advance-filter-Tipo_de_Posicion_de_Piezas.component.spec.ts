import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent } from './show-advance-filter-Tipo_de_Posicion_de_Piezas.component';

describe('ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent', () => {
  let component: ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_Posicion_de_PiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
