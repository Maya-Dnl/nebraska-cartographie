import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBuildingComponent } from './details-building.component';

describe('DetailsBuildingComponent', () => {
  let component: DetailsBuildingComponent;
  let fixture: ComponentFixture<DetailsBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsBuildingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
