import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Turbulencia_de_EstelaComponent } from './Turbulencia_de_Estela.component';

describe('Turbulencia_de_EstelaComponent', () => {
  let component: Turbulencia_de_EstelaComponent;
  let fixture: ComponentFixture<Turbulencia_de_EstelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Turbulencia_de_EstelaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Turbulencia_de_EstelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

