import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_Persona_NotificarComponent } from './show-advance-filter-Tipo_Persona_Notificar.component';

describe('ShowAdvanceFilterTipo_Persona_NotificarComponent', () => {
  let component: ShowAdvanceFilterTipo_Persona_NotificarComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_Persona_NotificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_Persona_NotificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_Persona_NotificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
