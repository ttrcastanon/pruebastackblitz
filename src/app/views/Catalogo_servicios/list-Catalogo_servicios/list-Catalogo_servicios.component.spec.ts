import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalogo_serviciosComponent } from './list-Catalogo_servicios.component';

describe('ListCatalogo_serviciosComponent', () => {
  let component: ListCatalogo_serviciosComponent;
  let fixture: ComponentFixture<ListCatalogo_serviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCatalogo_serviciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalogo_serviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
