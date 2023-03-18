import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCatalogo_codigo_ATAComponent } from './list-Catalogo_codigo_ATA.component';

describe('ListCatalogo_codigo_ATAComponent', () => {
  let component: ListCatalogo_codigo_ATAComponent;
  let fixture: ComponentFixture<ListCatalogo_codigo_ATAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCatalogo_codigo_ATAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCatalogo_codigo_ATAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
