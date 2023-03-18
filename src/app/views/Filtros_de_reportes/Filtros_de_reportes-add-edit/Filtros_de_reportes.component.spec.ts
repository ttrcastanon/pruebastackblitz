import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Filtros_de_reportesComponent } from './Filtros_de_reportes.component';

describe('Filtros_de_reportesComponent', () => {
  let component: Filtros_de_reportesComponent;
  let fixture: ComponentFixture<Filtros_de_reportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Filtros_de_reportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Filtros_de_reportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

