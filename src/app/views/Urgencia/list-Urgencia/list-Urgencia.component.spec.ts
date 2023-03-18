import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUrgenciaComponent } from './list-Urgencia.component';

describe('ListUrgenciaComponent', () => {
  let component: ListUrgenciaComponent;
  let fixture: ComponentFixture<ListUrgenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUrgenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUrgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
