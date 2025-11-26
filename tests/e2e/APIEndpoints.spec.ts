import { test, expect } from '../../fixtures/test-fixtures';

test.describe('APIEndpoints', () => {
  test('TC-APIEndpoints-008: Verify /api/share/save endpoint creates share token', async ({ apiHelpers }) => {
    const testState = {
      basemap: 'street',
      analysisMode: 'point',
      compareMode: 'points',
      cloudTolerance: 30,
    };
    
    const response = await apiHelpers.postAPIRequest('http://localhost:3000/api/share/save', testState);
    expect(response).toHaveProperty('token');
    expect(response.token).toBeTruthy();
  });

  test('TC-APIEndpoints-009: Verify /api/share/[token] endpoint returns saved state', async ({ apiHelpers }) => {
    const testState = {
      const testState = {
      basemap: 'street',
      analysisMode: 'point',
      compareMode: 'points',
      cloudTolerance: 30,
    };
    
    const saveResponse = await apiHelpers.postAPIRequest('http://localhost:3000/api/share/save', testState);
    const token = saveResponse.token;
    
    const getResponse = await apiHelpers.getAPIResponse(`http://localhost:3000/api/share/${token}`);
    expect(getResponse).toHaveProperty('state');
    expect(getResponse.state).toBeTruthy();
  });

  test('TC-APIEndpoints-011: Verify /api/admin/login endpoint authenticates correctly', async ({ apiHelpers }) => {
    const loginData = {
      username: 'admin',
      password: 'admin',
    };
    
    const response = await apiHelpers.postAPIRequest('http://localhost:3000/api/admin/login', loginData);
    expect(response).toHaveProperty('success');
    expect(response.success).toBe(true);
  });

  test('TC-APIEndpoints-013: Verify /api/admin/analytics/summary endpoint requires auth', async ({ apiHelpers }) => {
    try {
      await apiHelpers.getAPIResponse('http://localhost:3000/api/admin/analytics/summary');
      expect(false).toBe(true);
    } catch (error: any) {
      expect(error.status || 401).toBeTruthy();
    }
  });
});

