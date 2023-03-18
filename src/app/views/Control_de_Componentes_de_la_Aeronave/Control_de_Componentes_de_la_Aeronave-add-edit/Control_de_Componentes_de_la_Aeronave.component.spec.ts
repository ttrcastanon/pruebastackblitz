import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Control_de_Componentes_de_la_AeronaveComponent } from './Control_de_Componentes_de_la_Aeronave.component';

describe('Control_de_Componentes_de_la_AeronaveComponent', () => {
  let component: Control_de_Componentes_de_la_AeronaveComponent;
  let fixture: ComponentFixture<Control_de_Componentes_de_la_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Control_de_Componentes_de_la_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Control_de_Componentes_de_la_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

