import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_Incidencia_VuelosComponent } from './Layout_Incidencia_Vuelos.component';

describe('Layout_Incidencia_VuelosComponent', () => {
  let component: Layout_Incidencia_VuelosComponent;
  let fixture: ComponentFixture<Layout_Incidencia_VuelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_Incidencia_VuelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_Incidencia_VuelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

