import fetch from 'isomorphic-fetch';
import {API} from '../config'
import queryString from 'query-string';
import { isAuth, handleResponse } from './auth';

export const createBlog = (blog, token) => {
    let createBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        createBlogEndpoint = `${API}/blog`;
    } else if (isAuth() && isAuth().role === 0) {
        createBlogEndpoint = `${API}/user/blog`;
    }

    return fetch(`${createBlogEndpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
    .then(response => {
        handleResponse(response);
        return response.json();
    })
    .catch(err => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
    const data = {
        limit, skip
    };

    return fetch(`${API}/blogs-categories-tags`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const singleBlog = slug => {
    return fetch(`${API}/blog/${slug}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const listRelatedBlogs = (blog) => {
    return fetch(`${API}/blogs/related`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const listAllBlogs = (username) => {
    let listBlogsEndpoint;

    if (username) {
        listBlogsEndpoint = `${API}/${username}/blogs`;
    } else {
        listBlogsEndpoint = `${API}/blogs`;
    }

    return fetch(`${listBlogsEndpoint}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const listSearchBlogs = (params) => {
    // console.log('search params', params); // debug
    let query = queryString.stringify(params); // i.e. ?limit=100&pagination=10
    // console.log('query params', query);   // debug

    return fetch(`${API}/blogs/search?${query}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const removeBlog = (slug, token) => {
    let removeBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        removeBlogEndpoint = `${API}/blog/${slug}`;
    } else if (isAuth() && isAuth().role === 0) {
        removeBlogEndpoint = `${API}/user/blog/${slug}`;
    }

    return fetch(`${removeBlogEndpoint}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    .then(response => {
        handleResponse(response);
        return response.json();
    })
    .catch(err => console.log(err));
};

export const updateBlog = (blog, token, slug) => {
    let updateBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        updateBlogEndpoint = `${API}/blog/${slug}`;
    } else if (isAuth() && isAuth().role === 0) {
        updateBlogEndpoint = `${API}/user/blog/${slug}`;
    }

    return fetch(`${updateBlogEndpoint}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: blog
    })
    .then(response => {
        handleResponse(response);
        return response.json();
    })
    .catch(err => console.log(err));
};
