import { Router } from "express";
import userRoute from "./userRoutes";
import postRoute from "./postRoute";
import likeRoute from "./likeRoute";
import commentRoute from "./commentRoute";

const router = Router();

router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/like", likeRoute);
router.use("/comment", commentRoute);

export default router;
