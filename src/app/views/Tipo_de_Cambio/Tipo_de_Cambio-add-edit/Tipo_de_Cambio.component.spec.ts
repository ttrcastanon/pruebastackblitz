import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_CambioComponent } from './Tipo_de_Cambio.component';

describe('Tipo_de_CambioComponent', () => {
  let component: Tipo_de_CambioComponent;
  let fixture: ComponentFixture<Tipo_de_CambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_CambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_CambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

