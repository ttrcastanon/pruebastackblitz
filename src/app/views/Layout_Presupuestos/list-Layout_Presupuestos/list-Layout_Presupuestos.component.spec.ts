import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_PresupuestosComponent } from './list-Layout_Presupuestos.component';

describe('ListLayout_PresupuestosComponent', () => {
  let component: ListLayout_PresupuestosComponent;
  let fixture: ComponentFixture<ListLayout_PresupuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_PresupuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_PresupuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
