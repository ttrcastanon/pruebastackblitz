import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Aplicacion__de_PrestamoComponent } from './Aplicacion__de_Prestamo.component';

describe('Aplicacion__de_PrestamoComponent', () => {
  let component: Aplicacion__de_PrestamoComponent;
  let fixture: ComponentFixture<Aplicacion__de_PrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Aplicacion__de_PrestamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Aplicacion__de_PrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

