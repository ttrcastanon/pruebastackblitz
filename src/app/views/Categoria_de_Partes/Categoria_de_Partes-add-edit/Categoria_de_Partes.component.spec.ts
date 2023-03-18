import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categoria_de_PartesComponent } from './Categoria_de_Partes.component';

describe('Categoria_de_PartesComponent', () => {
  let component: Categoria_de_PartesComponent;
  let fixture: ComponentFixture<Categoria_de_PartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Categoria_de_PartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Categoria_de_PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

