
import express from "express";
import { addProduct,editProduct,getProducts } from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addProduct", verifyToken ,addProduct);
router.patch("/editProduct/:id", verifyToken ,editProduct);
router.get("/getProducts", verifyToken ,getProducts);

export default router;