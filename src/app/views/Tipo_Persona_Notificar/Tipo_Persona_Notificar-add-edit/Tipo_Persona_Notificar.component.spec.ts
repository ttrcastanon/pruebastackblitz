import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_Persona_NotificarComponent } from './Tipo_Persona_Notificar.component';

describe('Tipo_Persona_NotificarComponent', () => {
  let component: Tipo_Persona_NotificarComponent;
  let fixture: ComponentFixture<Tipo_Persona_NotificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_Persona_NotificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_Persona_NotificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

