import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProveedores_para_MSComponent } from './list-Proveedores_para_MS.component';

describe('ListProveedores_para_MSComponent', () => {
  let component: ListProveedores_para_MSComponent;
  let fixture: ComponentFixture<ListProveedores_para_MSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProveedores_para_MSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProveedores_para_MSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
