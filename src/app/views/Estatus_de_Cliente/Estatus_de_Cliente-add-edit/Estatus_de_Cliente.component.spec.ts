import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_ClienteComponent } from './Estatus_de_Cliente.component';

describe('Estatus_de_ClienteComponent', () => {
  let component: Estatus_de_ClienteComponent;
  let fixture: ComponentFixture<Estatus_de_ClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_ClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_ClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

