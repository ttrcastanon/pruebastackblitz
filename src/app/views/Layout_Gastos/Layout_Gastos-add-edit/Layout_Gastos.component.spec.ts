import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout_GastosComponent } from './Layout_Gastos.component';

describe('Layout_GastosComponent', () => {
  let component: Layout_GastosComponent;
  let fixture: ComponentFixture<Layout_GastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layout_GastosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layout_GastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

