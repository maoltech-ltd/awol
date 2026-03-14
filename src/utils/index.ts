export const cs = (...classNames: any) => classNames.filter(Boolean).join("")

export const sortBlogs = (blogs: any) => {
    
    return blogs.blogs.slice().sort(
        (a: any, b: any) => {
            return (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any);
        }
    );
};
