import request from "supertest";
import app from "../../app";
import db from "../database";

describe("Authentication Endpoints", () => {
  it("should login with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "henderson.briggs@geeknet.net",
      password: "23derd*334",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });

  it("should not login with invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "henderson.briggs@geeknet.net",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });

  it("should access protected route with valid token", async () => {
    // First login to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "henderson.briggs@geeknet.net",
      password: "23derd*334",
    });

    const token = loginResponse.body.token;

    // Test protected route
    const protectedResponse = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body).toHaveProperty("email");
  });
});
