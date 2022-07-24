export type Category = {
    _id?: string;
    name: string;
    link: string;
    description: string;
    image: string;
}

export type Post = {
    _id?: string;
    title: string;
    content: string;
    image?: string;
    link: string;
    readTime: number;
    active: boolean;
    category: Category;
    author: string;
    keywords: string;
    description: string;
    modifiedAt: Date;
    postedAt: Date;
};