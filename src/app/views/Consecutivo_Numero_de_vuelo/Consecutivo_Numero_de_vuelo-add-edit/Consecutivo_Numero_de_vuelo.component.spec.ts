import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Consecutivo_Numero_de_vueloComponent } from './Consecutivo_Numero_de_vuelo.component';

describe('Consecutivo_Numero_de_vueloComponent', () => {
  let component: Consecutivo_Numero_de_vueloComponent;
  let fixture: ComponentFixture<Consecutivo_Numero_de_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Consecutivo_Numero_de_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Consecutivo_Numero_de_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

