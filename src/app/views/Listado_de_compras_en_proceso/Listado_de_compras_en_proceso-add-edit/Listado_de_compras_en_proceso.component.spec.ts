import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_de_compras_en_procesoComponent } from './Listado_de_compras_en_proceso.component';

describe('Listado_de_compras_en_procesoComponent', () => {
  let component: Listado_de_compras_en_procesoComponent;
  let fixture: ComponentFixture<Listado_de_compras_en_procesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_de_compras_en_procesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_de_compras_en_procesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

