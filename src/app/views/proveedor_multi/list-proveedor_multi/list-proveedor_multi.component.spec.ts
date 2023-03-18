import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listproveedor_multiComponent } from './list-proveedor_multi.component';

describe('Listproveedor_multiComponent', () => {
  let component: Listproveedor_multiComponent;
  let fixture: ComponentFixture<Listproveedor_multiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listproveedor_multiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listproveedor_multiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
