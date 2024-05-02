import request from "supertest";
import app from "../src/app";
import { describe, it } from "node:test";


describe("Order Service", () => {
  it("should be added to cart", async () => {
    request(app)
      .post("/orders/checkout")
      .send({
        userId:"abc123456user",
        userName:"local user2",
        userEmail:"local2@eaxampl.com",
        cartSessionId: "f1802540-121b-42b5-8b3d-956cc82913e2"
      })
      .expect(201);
  });
})