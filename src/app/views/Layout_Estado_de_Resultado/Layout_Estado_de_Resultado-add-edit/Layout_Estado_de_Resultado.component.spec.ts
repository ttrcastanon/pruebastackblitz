import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_Estado_de_ResultadoComponent } from './Layout_Estado_de_Resultado.component';

describe('Layout_Estado_de_ResultadoComponent', () => {
  let component: Layout_Estado_de_ResultadoComponent;
  let fixture: ComponentFixture<Layout_Estado_de_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_Estado_de_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_Estado_de_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

