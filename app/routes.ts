import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("components/layout/SiteLayout/SiteLayout.tsx", [
    index("routes/home.tsx"),
    // kasnije: route("blog", "routes/blog.tsx"), route("blog/:slug", "routes/blog-post.tsx")
  ]),
] satisfies RouteConfig;
