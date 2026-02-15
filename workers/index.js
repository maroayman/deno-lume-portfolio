export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1) || "home";

    if (request.method === "GET") {
      const result = await env.DB.prepare(
        "SELECT views FROM views WHERE path = ?"
      ).bind(path).first();

      const views = result?.views || 0;
      return new Response(JSON.stringify({ path, views }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "POST") {
      const result = await env.DB.prepare(
        `INSERT INTO views (path, views) VALUES (?, 1)
         ON CONFLICT(path) DO UPDATE SET views = views + 1`
      ).bind(path).run();

      const count = await env.DB.prepare(
        "SELECT views FROM views WHERE path = ?"
      ).bind(path).first();

      return new Response(JSON.stringify({ path, views: count?.views || 1 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};
