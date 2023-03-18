import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_Persona_NotificarComponent } from './list-Tipo_Persona_Notificar.component';

describe('ListTipo_Persona_NotificarComponent', () => {
  let component: ListTipo_Persona_NotificarComponent;
  let fixture: ComponentFixture<ListTipo_Persona_NotificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_Persona_NotificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_Persona_NotificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
