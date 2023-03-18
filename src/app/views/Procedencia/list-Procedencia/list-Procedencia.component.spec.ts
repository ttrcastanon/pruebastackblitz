import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProcedenciaComponent } from './list-Procedencia.component';

describe('ListProcedenciaComponent', () => {
  let component: ListProcedenciaComponent;
  let fixture: ComponentFixture<ListProcedenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProcedenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProcedenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
