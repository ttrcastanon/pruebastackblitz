import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Formato_de_salida_de_aeronaveComponent } from './Formato_de_salida_de_aeronave.component';

describe('Formato_de_salida_de_aeronaveComponent', () => {
  let component: Formato_de_salida_de_aeronaveComponent;
  let fixture: ComponentFixture<Formato_de_salida_de_aeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Formato_de_salida_de_aeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Formato_de_salida_de_aeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

