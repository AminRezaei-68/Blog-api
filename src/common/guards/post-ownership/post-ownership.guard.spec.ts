import { PostOwnershipGuard } from './post-ownership.guard';

describe('PostOwnershipGuard', () => {
  it('should be defined', () => {
    expect(new PostOwnershipGuard()).toBeDefined();
  });
});
