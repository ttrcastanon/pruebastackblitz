import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_GastosComponent } from './list-Layout_Gastos.component';

describe('ListLayout_GastosComponent', () => {
  let component: ListLayout_GastosComponent;
  let fixture: ComponentFixture<ListLayout_GastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_GastosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_GastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
