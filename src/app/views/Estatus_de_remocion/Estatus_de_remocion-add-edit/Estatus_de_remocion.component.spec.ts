import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_remocionComponent } from './Estatus_de_remocion.component';

describe('Estatus_de_remocionComponent', () => {
  let component: Estatus_de_remocionComponent;
  let fixture: ComponentFixture<Estatus_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

