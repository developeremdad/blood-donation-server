import express from "express";
import { authRouters } from "../modules/auth/auth.routes";
import { requestRoutes } from "../modules/request/request.routes";
import { userRouters } from "../modules/user/user.routes";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRouters,
  },
  {
    path: "/",
    route: authRouters,
  },
  {
    path: "/",
    route: requestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
