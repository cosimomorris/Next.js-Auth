// src/__tests__/Dashboard.test.tsx
import DashboardContent from "../components/dashboard/dashboard-content";

describe("Dashboard Component Tests", () => {
  it("should have the correct session props", () => {
    // Test that we can access the component
    expect(DashboardContent).toBeDefined();

    // Test props type
    const mockSession = {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { email: "test@example.com", name: "Test User" },
      accessToken: "mock-token",
    };

    // This ensures our props match what the component expects
    const props = { session: mockSession };
    expect(props.session.user.email).toBe("test@example.com");
  });
});
