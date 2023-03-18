import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPiezas_RequeridasComponent } from './list-Piezas_Requeridas.component';

describe('ListPiezas_RequeridasComponent', () => {
  let component: ListPiezas_RequeridasComponent;
  let fixture: ComponentFixture<ListPiezas_RequeridasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPiezas_RequeridasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPiezas_RequeridasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
