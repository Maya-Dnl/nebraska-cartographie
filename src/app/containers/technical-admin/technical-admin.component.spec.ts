import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalAdminComponent } from './technical-admin.component';

describe('TechnicalAdminComponent', () => {
  let component: TechnicalAdminComponent;
  let fixture: ComponentFixture<TechnicalAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicalAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicalAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
