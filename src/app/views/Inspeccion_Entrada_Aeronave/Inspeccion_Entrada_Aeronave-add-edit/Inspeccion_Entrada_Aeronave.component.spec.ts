import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inspeccion_Entrada_AeronaveComponent } from './Inspeccion_Entrada_Aeronave.component';

describe('Inspeccion_Entrada_AeronaveComponent', () => {
  let component: Inspeccion_Entrada_AeronaveComponent;
  let fixture: ComponentFixture<Inspeccion_Entrada_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Inspeccion_Entrada_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Inspeccion_Entrada_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

