import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Control_de_ComponentesComponent } from './Control_de_Componentes.component';

describe('Control_de_ComponentesComponent', () => {
  let component: Control_de_ComponentesComponent;
  let fixture: ComponentFixture<Control_de_ComponentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Control_de_ComponentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Control_de_ComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

