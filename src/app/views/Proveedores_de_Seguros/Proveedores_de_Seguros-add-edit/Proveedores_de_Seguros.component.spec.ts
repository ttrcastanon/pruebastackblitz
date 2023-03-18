import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Proveedores_de_SegurosComponent } from './Proveedores_de_Seguros.component';

describe('Proveedores_de_SegurosComponent', () => {
  let component: Proveedores_de_SegurosComponent;
  let fixture: ComponentFixture<Proveedores_de_SegurosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Proveedores_de_SegurosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Proveedores_de_SegurosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

