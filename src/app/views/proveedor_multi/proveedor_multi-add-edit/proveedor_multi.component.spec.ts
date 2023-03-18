import { ComponentFixture, TestBed } from '@angular/core/testing';
import { proveedor_multiComponent } from './proveedor_multi.component';

describe('proveedor_multiComponent', () => {
  let component: proveedor_multiComponent;
  let fixture: ComponentFixture<proveedor_multiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ proveedor_multiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(proveedor_multiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

