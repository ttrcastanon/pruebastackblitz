import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Solicitudes_de_mantenimientos_externosComponent } from './Solicitudes_de_mantenimientos_externos.component';

describe('Solicitudes_de_mantenimientos_externosComponent', () => {
  let component: Solicitudes_de_mantenimientos_externosComponent;
  let fixture: ComponentFixture<Solicitudes_de_mantenimientos_externosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Solicitudes_de_mantenimientos_externosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Solicitudes_de_mantenimientos_externosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

