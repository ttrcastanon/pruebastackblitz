import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_ClienteComponent } from './Tipo_de_Cliente.component';

describe('Tipo_de_ClienteComponent', () => {
  let component: Tipo_de_ClienteComponent;
  let fixture: ComponentFixture<Tipo_de_ClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_ClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_ClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

