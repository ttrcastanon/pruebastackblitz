import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Documentacion_PAXsComponent } from './Tipo_de_Documentacion_PAXs.component';

describe('Tipo_de_Documentacion_PAXsComponent', () => {
  let component: Tipo_de_Documentacion_PAXsComponent;
  let fixture: ComponentFixture<Tipo_de_Documentacion_PAXsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Documentacion_PAXsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Documentacion_PAXsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

