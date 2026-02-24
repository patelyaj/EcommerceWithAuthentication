
import express from "express";
import { addProduct,editProduct,getFilters,getProducts } from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addProduct", verifyToken ,addProduct);
router.patch("/editProduct/:id", verifyToken ,editProduct);
router.get("/getProducts", verifyToken ,getProducts);
router.get("/filters", verifyToken ,getFilters);
export default router;