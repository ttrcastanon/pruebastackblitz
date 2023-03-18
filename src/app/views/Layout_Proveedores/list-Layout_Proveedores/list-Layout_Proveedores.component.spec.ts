import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_ProveedoresComponent } from './list-Layout_Proveedores.component';

describe('ListLayout_ProveedoresComponent', () => {
  let component: ListLayout_ProveedoresComponent;
  let fixture: ComponentFixture<ListLayout_ProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_ProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
