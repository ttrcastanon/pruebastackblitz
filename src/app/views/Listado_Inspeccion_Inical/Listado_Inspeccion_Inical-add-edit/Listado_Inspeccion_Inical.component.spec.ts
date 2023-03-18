import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_Inspeccion_InicalComponent } from './Listado_Inspeccion_Inical.component';

describe('Listado_Inspeccion_InicalComponent', () => {
  let component: Listado_Inspeccion_InicalComponent;
  let fixture: ComponentFixture<Listado_Inspeccion_InicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_Inspeccion_InicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_Inspeccion_InicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

