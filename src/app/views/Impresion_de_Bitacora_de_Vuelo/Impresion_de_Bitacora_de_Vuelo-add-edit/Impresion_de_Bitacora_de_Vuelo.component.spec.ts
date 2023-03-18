import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Impresion_de_Bitacora_de_VueloComponent } from './Impresion_de_Bitacora_de_Vuelo.component';

describe('Impresion_de_Bitacora_de_VueloComponent', () => {
  let component: Impresion_de_Bitacora_de_VueloComponent;
  let fixture: ComponentFixture<Impresion_de_Bitacora_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Impresion_de_Bitacora_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Impresion_de_Bitacora_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

