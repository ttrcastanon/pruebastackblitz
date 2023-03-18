import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_de_MaterialesComponent } from './Listado_de_Materiales.component';

describe('Listado_de_MaterialesComponent', () => {
  let component: Listado_de_MaterialesComponent;
  let fixture: ComponentFixture<Listado_de_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_de_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_de_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

