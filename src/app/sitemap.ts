import { MetadataRoute } from "next";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://awol.naijup.ng";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/signin`, lastModified: new Date() },
    { url: `${baseUrl}/signup`, lastModified: new Date() },
    { url: `${baseUrl}/not-found`, lastModified: new Date() },
    { url: `${baseUrl}/edituserprofile`, lastModified: new Date() },
    { url: `${baseUrl}/customer/products`, lastModified: new Date() },
  ];


  return [...staticRoutes];
}
