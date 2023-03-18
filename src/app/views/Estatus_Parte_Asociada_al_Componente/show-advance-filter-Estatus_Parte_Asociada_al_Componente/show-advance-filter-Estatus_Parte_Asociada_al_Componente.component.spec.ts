import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent } from './show-advance-filter-Estatus_Parte_Asociada_al_Componente.component';

describe('ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent', () => {
  let component: ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_Parte_Asociada_al_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
