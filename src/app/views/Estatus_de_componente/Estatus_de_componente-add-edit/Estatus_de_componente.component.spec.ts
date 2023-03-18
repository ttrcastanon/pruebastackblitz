import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_componenteComponent } from './Estatus_de_componente.component';

describe('Estatus_de_componenteComponent', () => {
  let component: Estatus_de_componenteComponent;
  let fixture: ComponentFixture<Estatus_de_componenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_componenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_componenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

