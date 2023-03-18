import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_de_Vuelo_a_FacturarComponent } from './Listado_de_Vuelo_a_Facturar.component';

describe('Listado_de_Vuelo_a_FacturarComponent', () => {
  let component: Listado_de_Vuelo_a_FacturarComponent;
  let fixture: ComponentFixture<Listado_de_Vuelo_a_FacturarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_de_Vuelo_a_FacturarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_de_Vuelo_a_FacturarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

