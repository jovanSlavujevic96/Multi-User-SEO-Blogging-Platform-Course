import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import React, { userState } from 'react';
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import Card from '../../components/blog/Card';

const Blogs = ({ blogs, categories, tags, size }) => {
    const showAllBlogs = () => {
        return blogs.map((blog, i) => {

            return <article key={i}>
                <Card blog={blog} />
                <hr/>
            </article>
        });
    };

    return (
        <Layout>
            <main>
                <div className='container-fluid'>
                    <header>
                        <div className="col-md-12 pt-3">
                            <h1 className='display-4 font-weight-bold text-center'>Programming blogs and tutorials</h1>
                        </div>
                        <section>
                            <p>show categories and tags</p>
                        </section>
                    </header>
                </div>
                <div className='container-fluid'>
                    <div className="row">
                        <div className="col-md-12">{showAllBlogs()}</div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

// get initial Props can be used only on pages, not in components
Blogs.getInitialProps = () => {
    // execute function that makes a request to your back-end (server)
    // and then get the data and then return the data
    // !! IMPORTANT -> return DATA

    return listBlogsWithCategoriesAndTags().then(data => {
        if (data.error) {
            console.log(data.error);
        }
        else {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                size: data.size,
            };
        }
    });
};

export default Blogs; // getInitialProps
