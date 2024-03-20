const request = require("supertest");
const app = require("../server");

var userToken;
var anotherUserToken;
var anotherUserNoteId;
var createdNoteId;

beforeAll(async () => {
  await request(app)
    .post("/user/register")
    .send({ username: "testuser", password: "testpassword" });

  const loginRes = await request(app)
    .post("/user/login")
    .send({ username: "testuser", password: "testpassword" });

  userToken = await loginRes.body.token;

  // Register anotheruser and get token
  await request(app)
    .post("/user/register")
    .send({ username: "anotheruser", password: "anotherpassword" });

  const anotherUserLoginRes = await request(app)
    .post("/user/login")
    .send({ username: "anotheruser", password: "anotherpassword" });

  anotherUserToken = anotherUserLoginRes.body.token;

  // Create a note for anotheruser
  const noteRes = await request(app)
    .post("/notes")
    .set("Authorization", `${anotherUserToken}`)
    .send({ title: "Another User's Note", content: "Confidential content" });

  anotherUserNoteId = noteRes.body._id;
});

describe("Notes Endpoints", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/notes")
      .set("Authorization", `${userToken}`)
      .send({ title: "Test Note", content: "This is a test note content" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    createdNoteId = res.body._id;
  });
  it("should get all notes", async () => {
    const res = await request(app).get("/notes");

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
  it("should get a single note by ID", async () => {
    const res = await request(app).get(`/notes/${createdNoteId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", createdNoteId);
  });
  it("should update a note", async () => {
    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .set("Authorization", `${userToken}`)
      .send({ title: "Updated Note Title", content: "Updated content" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", createdNoteId);
    expect(res.body).toHaveProperty("title", "Updated Note Title");
    expect(res.body).toHaveProperty("content", "Updated content");
  });
  it("should delete a note", async () => {
    const res = await request(app)
      .delete(`/notes/${createdNoteId}`)
      .set("Authorization", `${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Note deleted successfully");
  });
  it("should not create a note with empty title", async () => {
    const res = await request(app)
      .post("/notes")
      .set("Authorization", `${userToken}`)
      .send({ title: "", content: "test content" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual("Title is required");
  });
  it("should not create a note with empty content", async () => {
    const res = await request(app)
      .post("/notes")
      .set("Authorization", `${userToken}`)
      .send({ title: "test title", content: "" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual("Content is required");
  });
  it("should not create a note with title exceeding the character limit", async () => {
    const longTitle =
      "thistitleistoolongtopassthevalidationtestandwillfailforsure";
    const res = await request(app)
      .post("/notes")
      .set("Authorization", `${userToken}`)
      .send({ title: longTitle, content: "test content" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual(
      "Title must be between 1 and 50 characters"
    );
  });
  it("should not create a note with content exceeding the character limit", async () => {
    const longContent = "a".repeat(1111);
    const res = await request(app)
      .post("/notes")
      .set("Authorization", `${userToken}`)
      .send({ title: "test title", content: longContent });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual(
      "Content must be between 1 and 1000 characters"
    );
  });
  it("should not create a note with title under the character limit", async () => {
    const res = await request(app)
      .post("/notes")
      .set("Authorization", `${userToken}`)
      .send({ title: "t", content: "test content" });

    expect(res.status).toBe(400);
   expect(res.body.errors[0].msg).toEqual(
     "Title must be between 1 and 50 characters"
   );
  });
  it("should not create a note with content under the character limit", async () => {
    const res = await request(app)
      .post("/notes")
      .set("Authorization", `${userToken}`)
      .send({ title: "test title", content: "c" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toEqual(
      "Content must be between 1 and 1000 characters"
    );
  });
  it("should not create a note without logging in", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "Test Note", content: "This is a test note content" });

    expect(res.status).toBe(401);
  });
  it("should not update a note without logging in", async () => {
    const res = await request(app)
      .put(`/notes/${createdNoteId}`)
      .send({ title: "Updated Note Title", content: "Updated content" });

    expect(res.status).toBe(401);
  });
  it("should not update another user's note", async () => {
    const res = await request(app)
      .put(`/notes/${anotherUserNoteId}`)
      .set("Authorization", `${userToken}`)
      .send({ title: "Modified Title", content: "Modified content" });

    expect(res.status).toBe(403);
  });
  it("should not delete another user's note", async () => {
    const res = await request(app)
      .delete(`/notes/${anotherUserNoteId}`)
      .set("Authorization", `${userToken}`);

    expect(res.status).toBe(403);
  });
});
