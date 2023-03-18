import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConceptoComponent } from './list-Concepto.component';

describe('ListConceptoComponent', () => {
  let component: ListConceptoComponent;
  let fixture: ComponentFixture<ListConceptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConceptoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
