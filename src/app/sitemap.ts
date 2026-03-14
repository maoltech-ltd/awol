import { MetadataRoute } from "next";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://naijup.ng";

  let blogs: any[] = [];
  let categories: any[] = [];

  try {
    const blogRes = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store"
    });
    
    const categoryRes = await fetch(`${baseUrl}/api/categories`, {
      cache: "no-store"
    });
    if (blogRes.ok) blogs = (await blogRes.json()).results || [];
    if (categoryRes.ok) categories = (await categoryRes.json()).results || [];
  } catch (err) {
    console.error("Sitemap fetch error:", err);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/signin`, lastModified: new Date() },
    { url: `${baseUrl}/signup`, lastModified: new Date() },
    { url: `${baseUrl}/not-found`, lastModified: new Date() },
    { url: `${baseUrl}/edituserprofile`, lastModified: new Date() },
    { url: `${baseUrl}/createpost`, lastModified: new Date() },
    { url: `${baseUrl}/market`, lastModified: new Date() },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || Date.now()),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...blogRoutes, ...categoryRoutes];
}
