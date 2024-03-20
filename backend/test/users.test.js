const request = require("supertest");
const app = require("../server");

describe("User Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ username: "testuser", password: "testpassword" });

    expect(res.status).toBe(201);
    expect(res.body.message).toEqual("User registered successfully");
  });
  it("should not register a user with an existing username", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ username: "testuser", password: "testpassword" });

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual("A User with this Username already exists");
  });
  it("should not register a user with a username exceeding the character limit",
    async () => {
      const longUsername = "thisusernameistoolongtobeaccepted";
      const res = await request(app)
        .post("/user/register")
        .send({ username: longUsername, password: "testpassword" });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].msg).toEqual(
        "Username must be between 5 and 16 characters"
      );
    }
  );
  it("should not register a user without a username", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ password: "testpassword" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual("Username is required");
  });
  it("should not register a user without a password", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ username: "testuser3" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual("Password is required");
  });
  it("should not register a user with a weak password", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({ username: "testuser2", password: "weak" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual(
      "Password must be between 6 and 20 characters"
    );
  });
  it("should not register a user with a password exceeding the character limit", async () => {
    const longPassword = "thisPasswordistoolongtobeaccepted";
    const res = await request(app)
      .post("/user/register")
      .send({ username: "testuser3", password: longPassword });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual(
      "Password must be between 6 and 20 characters"
    );
  });
  it("should log in an existing user", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Login successful");
    expect(res.body).toHaveProperty("token");
  });
  it("should not log in with an empty password", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ username: "testuser" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual("Password is required");
  });
  it("should not log in with an empty username", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ username: "", password: "testpassword" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual("Username is required");
  });
});
