import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Proveedores_para_MSComponent } from './Proveedores_para_MS.component';

describe('Proveedores_para_MSComponent', () => {
  let component: Proveedores_para_MSComponent;
  let fixture: ComponentFixture<Proveedores_para_MSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Proveedores_para_MSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Proveedores_para_MSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

