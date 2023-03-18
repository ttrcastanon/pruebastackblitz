import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_Gestion_AprobacionComponent } from './Estatus_Gestion_Aprobacion.component';

describe('Estatus_Gestion_AprobacionComponent', () => {
  let component: Estatus_Gestion_AprobacionComponent;
  let fixture: ComponentFixture<Estatus_Gestion_AprobacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_Gestion_AprobacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_Gestion_AprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

