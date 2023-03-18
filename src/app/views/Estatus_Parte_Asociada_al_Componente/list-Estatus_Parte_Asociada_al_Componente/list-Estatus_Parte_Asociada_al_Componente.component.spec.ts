import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_Parte_Asociada_al_ComponenteComponent } from './list-Estatus_Parte_Asociada_al_Componente.component';

describe('ListEstatus_Parte_Asociada_al_ComponenteComponent', () => {
  let component: ListEstatus_Parte_Asociada_al_ComponenteComponent;
  let fixture: ComponentFixture<ListEstatus_Parte_Asociada_al_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_Parte_Asociada_al_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_Parte_Asociada_al_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
