import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_TransportacionComponent } from './Tipo_de_Transportacion.component';

describe('Tipo_de_TransportacionComponent', () => {
  let component: Tipo_de_TransportacionComponent;
  let fixture: ComponentFixture<Tipo_de_TransportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_TransportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_TransportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

