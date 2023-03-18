import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_ProveedoresComponent } from './Layout_Proveedores.component';

describe('Layout_ProveedoresComponent', () => {
  let component: Layout_ProveedoresComponent;
  let fixture: ComponentFixture<Layout_ProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_ProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

