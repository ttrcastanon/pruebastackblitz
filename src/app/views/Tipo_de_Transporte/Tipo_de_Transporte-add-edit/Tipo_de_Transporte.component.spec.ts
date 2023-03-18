import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_TransporteComponent } from './Tipo_de_Transporte.component';

describe('Tipo_de_TransporteComponent', () => {
  let component: Tipo_de_TransporteComponent;
  let fixture: ComponentFixture<Tipo_de_TransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_TransporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_TransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

