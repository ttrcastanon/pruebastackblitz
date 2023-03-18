import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_CMP_a_CotizarComponent } from './Estatus_de_CMP_a_Cotizar.component';

describe('Estatus_de_CMP_a_CotizarComponent', () => {
  let component: Estatus_de_CMP_a_CotizarComponent;
  let fixture: ComponentFixture<Estatus_de_CMP_a_CotizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_CMP_a_CotizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_CMP_a_CotizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

