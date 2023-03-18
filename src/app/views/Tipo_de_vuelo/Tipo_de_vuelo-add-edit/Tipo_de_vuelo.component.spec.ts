import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_vueloComponent } from './Tipo_de_vuelo.component';

describe('Tipo_de_vueloComponent', () => {
  let component: Tipo_de_vueloComponent;
  let fixture: ComponentFixture<Tipo_de_vueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_vueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_vueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

