import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent } from './show-advance-filter-Remocion_e_instalacion_de_piezas.component';

describe('ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent', () => {
  let component: ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterRemocion_e_instalacion_de_piezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
