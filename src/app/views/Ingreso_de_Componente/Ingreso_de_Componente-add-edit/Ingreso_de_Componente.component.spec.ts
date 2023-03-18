import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ingreso_de_ComponenteComponent } from './Ingreso_de_Componente.component';

describe('Ingreso_de_ComponenteComponent', () => {
  let component: Ingreso_de_ComponenteComponent;
  let fixture: ComponentFixture<Ingreso_de_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ingreso_de_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ingreso_de_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

