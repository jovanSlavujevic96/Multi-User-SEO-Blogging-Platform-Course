import Link from 'next/link';

import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import BlogCreate from '../../../components/crud/BlogCreate';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';
import BlogRead from '../../../components/crud/BlogRead';

const Blog = () => {
    // <Link> is repalcement for <a> HTML tag
    // it avoids loading of other page
    // it just replaces components
    // but it keeps <a> within
    return (
        <Layout>
            <Admin>
                <div className="container">
                    <div className='row'>
                        <div className='col-md-12 pt-5 pb-5'>
                            <h2>Manage blogs</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogRead/>
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    );
};

export default Blog;
