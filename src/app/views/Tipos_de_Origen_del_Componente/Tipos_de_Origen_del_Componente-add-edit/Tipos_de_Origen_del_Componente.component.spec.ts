import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipos_de_Origen_del_ComponenteComponent } from './Tipos_de_Origen_del_Componente.component';

describe('Tipos_de_Origen_del_ComponenteComponent', () => {
  let component: Tipos_de_Origen_del_ComponenteComponent;
  let fixture: ComponentFixture<Tipos_de_Origen_del_ComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipos_de_Origen_del_ComponenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipos_de_Origen_del_ComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

