import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_Parte_Asociada_al_ComponenteComponent } from './Estatus_Parte_Asociada_al_Componente.component';

describe('Estatus_Parte_Asociada_al_ComponenteComponent', () => {
  let component: Estatus_Parte_Asociada_al_ComponenteComponent;
  let fixture: ComponentFixture<Estatus_Parte_Asociada_al_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_Parte_Asociada_al_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_Parte_Asociada_al_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

