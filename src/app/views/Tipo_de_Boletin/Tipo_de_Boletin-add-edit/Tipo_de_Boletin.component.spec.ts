import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_BoletinComponent } from './Tipo_de_Boletin.component';

describe('Tipo_de_BoletinComponent', () => {
  let component: Tipo_de_BoletinComponent;
  let fixture: ComponentFixture<Tipo_de_BoletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_BoletinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_BoletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

