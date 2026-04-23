describe('Course Version Control', () => {
  it('lists versions', async () => {
    const versions = await service.listVersions('course1');
    expect(versions.length).toBeGreaterThan(0);
  });

  it('restores a version', async () => {
    const result = await service.restoreVersion('course1', 'version1');
    expect(result.success).toBe(true);
  });
});
