import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_PresupuestosComponent } from './Layout_Presupuestos.component';

describe('Layout_PresupuestosComponent', () => {
  let component: Layout_PresupuestosComponent;
  let fixture: ComponentFixture<Layout_PresupuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_PresupuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_PresupuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

