import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Creacion_de_ClientesComponent } from './Creacion_de_Clientes.component';

describe('Creacion_de_ClientesComponent', () => {
  let component: Creacion_de_ClientesComponent;
  let fixture: ComponentFixture<Creacion_de_ClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Creacion_de_ClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Creacion_de_ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

