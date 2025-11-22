import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route"
import { UserRoutes } from "../modules/user/user.route";
import { PostRoutes } from "../modules/post/post.route";
import { LikeRoutes } from "../modules/like/like.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes
    },

    {
        path: "/user",
        route: UserRoutes
    },

    {
        path: "/posts",
        route: PostRoutes
    },

    {
        path: "/",
        route: LikeRoutes
    },

];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});