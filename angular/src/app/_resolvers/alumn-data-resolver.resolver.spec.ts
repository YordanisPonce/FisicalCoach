import { TestBed } from '@angular/core/testing';

import { AlumnDataResolverResolver } from './alumn-data-resolver.resolver';

describe('AlumnDataResolverResolver', () => {
  let resolver: AlumnDataResolverResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AlumnDataResolverResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
