import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_InstalacionComponent } from './Tipo_de_Instalacion.component';

describe('Tipo_de_InstalacionComponent', () => {
  let component: Tipo_de_InstalacionComponent;
  let fixture: ComponentFixture<Tipo_de_InstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_InstalacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_InstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

