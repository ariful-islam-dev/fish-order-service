import express from "express";
import cors from "cors";
import morgan from "morgan";
import { checkout, getOrders, getOrdersById } from "./controllers";

const app = express();

app.use([express.json(), cors(), morgan("dev")]);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.post("/orders/checkout", checkout)

<<<<<<< HEAD
app.get("/orders/:id", getOrdersById) 
=======
app.post("/cart/add-to-cart", addToCart)
>>>>>>> 2c25aab76959ed0593e53a25854a4685b7a506d8

app.get("/orders", getOrders)

// 404 Error
app.use((_req, res, next) => {
  res.status(404).json({ code: 404, message: " Resource Not Found" });
});
// Error
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).json({ code: 500, message: "Internal Server Error" });
});

export default app;
