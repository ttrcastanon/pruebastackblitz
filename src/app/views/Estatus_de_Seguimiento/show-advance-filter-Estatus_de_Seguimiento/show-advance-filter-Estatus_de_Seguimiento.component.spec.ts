import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_SeguimientoComponent } from './show-advance-filter-Estatus_de_Seguimiento.component';

describe('ShowAdvanceFilterEstatus_de_SeguimientoComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_SeguimientoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_SeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_SeguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_SeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
