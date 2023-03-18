import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Politica_de_ProveedoresComponent } from './Politica_de_Proveedores.component';

describe('Politica_de_ProveedoresComponent', () => {
  let component: Politica_de_ProveedoresComponent;
  let fixture: ComponentFixture<Politica_de_ProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Politica_de_ProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Politica_de_ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

