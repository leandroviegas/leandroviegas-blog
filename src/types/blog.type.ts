export type Topic = {
    _id?: string;
    name: string;
    link: string;
    description: string;
    image: string;
}

export type Comment = {
    _id?: string;
    content: string;
    user: {
        _id: string;
        username: string;
        profilePicture: string;
        link: string;
    };
    referenceComment: string
    post: string;
    postedAt: Date;
    modifiedAt: Date;
}

export type Roles = "admin" | "author" | "user";

export type User = {
    _id?: string;
    link: string;
    active: boolean;
    username: string;
    email: string;
    about: string;
    linkedin: string;
    github: string;
    profilePicture: string;
    role: Roles | string;
    ocupation: string;
}

export type Post = {
    _id?: string;
    title: string;
    content: string;
    image?: string;
    link: string;
    readTime: number;
    active: boolean;
    keywords: string;
    description: string;
    modifiedAt: Date;
    postedAt: Date;
    topics: Topic[] | string[];
    author: User;
}