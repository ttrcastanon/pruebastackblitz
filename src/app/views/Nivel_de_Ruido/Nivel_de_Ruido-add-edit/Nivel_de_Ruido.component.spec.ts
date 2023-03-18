import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Nivel_de_RuidoComponent } from './Nivel_de_Ruido.component';

describe('Nivel_de_RuidoComponent', () => {
  let component: Nivel_de_RuidoComponent;
  let fixture: ComponentFixture<Nivel_de_RuidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Nivel_de_RuidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Nivel_de_RuidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

