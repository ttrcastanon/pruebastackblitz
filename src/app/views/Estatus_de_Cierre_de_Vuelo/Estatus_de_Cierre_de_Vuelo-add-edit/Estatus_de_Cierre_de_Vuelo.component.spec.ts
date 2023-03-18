import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_Cierre_de_VueloComponent } from './Estatus_de_Cierre_de_Vuelo.component';

describe('Estatus_de_Cierre_de_VueloComponent', () => {
  let component: Estatus_de_Cierre_de_VueloComponent;
  let fixture: ComponentFixture<Estatus_de_Cierre_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_Cierre_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_Cierre_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

