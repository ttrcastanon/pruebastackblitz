import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent } from './show-advance-filter-Estatus_de_Cierre_de_Vuelo.component';

describe('ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_Cierre_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
