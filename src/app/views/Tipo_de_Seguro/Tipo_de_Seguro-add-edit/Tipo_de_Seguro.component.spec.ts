import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_SeguroComponent } from './Tipo_de_Seguro.component';

describe('Tipo_de_SeguroComponent', () => {
  let component: Tipo_de_SeguroComponent;
  let fixture: ComponentFixture<Tipo_de_SeguroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_SeguroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_SeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

