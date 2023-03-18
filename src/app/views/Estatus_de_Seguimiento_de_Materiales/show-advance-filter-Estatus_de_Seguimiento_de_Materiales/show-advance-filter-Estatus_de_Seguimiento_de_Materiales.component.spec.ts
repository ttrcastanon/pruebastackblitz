import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent } from './show-advance-filter-Estatus_de_Seguimiento_de_Materiales.component';

describe('ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent', () => {
  let component: ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_de_Seguimiento_de_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
