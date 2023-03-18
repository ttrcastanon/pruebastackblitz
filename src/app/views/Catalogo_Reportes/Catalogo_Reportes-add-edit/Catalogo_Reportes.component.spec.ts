import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Catalogo_ReportesComponent } from './Catalogo_Reportes.component';

describe('Catalogo_ReportesComponent', () => {
  let component: Catalogo_ReportesComponent;
  let fixture: ComponentFixture<Catalogo_ReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Catalogo_ReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Catalogo_ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

