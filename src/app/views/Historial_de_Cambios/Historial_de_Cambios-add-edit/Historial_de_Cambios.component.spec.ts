import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Historial_de_CambiosComponent } from './Historial_de_Cambios.component';

describe('Historial_de_CambiosComponent', () => {
  let component: Historial_de_CambiosComponent;
  let fixture: ComponentFixture<Historial_de_CambiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Historial_de_CambiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Historial_de_CambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

