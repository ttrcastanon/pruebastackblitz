import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Documentos_RequeridosComponent } from './Documentos_Requeridos.component';

describe('Documentos_RequeridosComponent', () => {
  let component: Documentos_RequeridosComponent;
  let fixture: ComponentFixture<Documentos_RequeridosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Documentos_RequeridosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Documentos_RequeridosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

