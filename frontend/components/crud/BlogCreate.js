import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';
import { QuillModules, QuillFormats } from '../../helpers/quill';

/* import react-quill dynamically but with SSR on false */
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})

// import CSS
import '../../node_modules/react-quill/dist/quill.snow.css';

const CreateBlog = ({router}) => {
    /** blog from local storage */
    const blogFromLS = () => {
        if (typeof window === 'undefined') {
            return false;
        }

        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        }
        else {
            return false;
        }
    }

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCategory, setCheckedCategory] = useState([]); // categories
    const [checkedTag, setCheckedTag] = useState([]); // tags

    const [body, setBody] = useState( blogFromLS() );

    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton: false
    });

    const { error, sizeError, success, formData, title, hidePublishButton } = values;
    const token = getCookie('token');

    useEffect(() => {
        setValues({...values, formData: new FormData()})

        initCategories();
        initTags();
    }, [router]);

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            }
            else {
                setCategories(data);
            }
        });
        setCheckedCategory([]);
    };

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            }
            else {
                setTags(data);
            }
        });
        setCheckedTag([]);
    };

    const handleChange = name => e => {
        // test
        // console.log(e.taget.value);

        /* grab the first file in files array if it's photo*/
        const value = (name === 'photo') ? e.target.files[0] : e.target.value
        formData.set(name, value);
        setValues({...values, [name]: value, formData: formData, error: ''})
    };

    // this is for rich text editor
    const handleBody = e => {
        // console.log(e.taget.value);
        setBody(e);
        formData.set('body', e);
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    };

    // we return another function because of build error: `too many renders`
    const handleToggleCategory = (cat_id) => () => {
        setValues({...values, error: ''});

        // return the first element or -1
        const clickedCategory = checkedCategory.indexOf(cat_id)
        const all = [...checkedCategory];

        if (clickedCategory === -1) {
            // if doesn't exist -> it means that is checked and needs to be pushed to array
            all.push(cat_id); // push it within
        }
        else {
            // if exists -> it means that is un-checked and needs to be erased from array
            all.splice(clickedCategory, 1); // pull it out
        }

        // console.log(all); // debug information
        setCheckedCategory(all);
        formData.set('categories', all);
    }

    const handleToggleTag = (tag_id) => () => {
        setValues({...values, error: ''});

        // return the first element or -1
        const clickedTag = checkedTag.indexOf(tag_id)
        const all = [...checkedTag];

        if (clickedTag === -1) {
            // if doesn't exist -> it means that is checked and needs to be pushed to array
            all.push(tag_id); // push it within
        }
        else {
            // if exists -> it means that is un-checked and needs to be erased from array
            all.splice(clickedTag, 1); // pull it out
        }

        // console.log(all); // debug information
        setCheckedTag(all);
        formData.set('tags', all);
    }

    const showCategories = () => {
        /* c - category ; i - index */
        return (
            categories && categories.map((c, i) => {
                return (
                    <li key={i} className="list-unstyled">
                        <input onChange={handleToggleCategory(c._id)} type="checkbox" className="mr-2"/>
                        <label className="form-check-label">{c.name}</label>
                    </li>
                );
            })
        );
    };

    const showTags = () => {
        /* t - tag ; i - index */
        return (
            tags && tags.map((t, i) => {
                return (
                    <li key={i} className="list-unstyled">
                        <input onChange={handleToggleTag(t._id)} type="checkbox" className="mr-2"/>
                        <label className="form-check-label">{t.name}</label>
                    </li>
                );
            })
        );
    };

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>{error}</div>
    );

    const showSuccess = () => (
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>{success}</div>
    );

    const publishBlog = (e) => {
        e.preventDefault();
        // console.log('ready to publishBlog'); // debug info

        createBlog(formData, token).then(data => {
            if (data.error) {
                console.log(data.error); // debug
                setValues({...values, error: data.error});
            }
            else {
                setValues({...values,
                    title: '',
                    error: '',
                    success: `A new blog titled "${formData.get('title')}" is created`
                });
                setBody(''); /* when we set the body to empty string it also clears the local storage,
                                because local storage is in sync with our state */

                setCategories([]);
                setTags([]);

                initCategories();
                initTags();
            }
        });
    };

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={handleChange('title')}
                    />
                </div>

                <div className="form-group">
                    <ReactQuill
                        modules={QuillModules}
                        formats={QuillFormats}
                        value={body}
                        placeholder="Write something amazing"
                        onChange={handleBody}
                    />
                </div>

                <div>
                    <button className="btn btn-primary">Publish</button>
                </div>
            </form>
        );
    };

    return <div className="container-fluid pb-5">
        <div className="row">
            <div className="col-md-8">
                {createBlogForm()}
                <div className="pt-3">
                    {showError()}
                    {showSuccess()}
                </div>
            </div>

            <div className="col-md-4">
                <div>
                    <div className="form-group pb-2">
                        <h5>Featured image</h5>
                        <hr/>

                        <small className="text-muted">Max size: 1 MB</small>
                        <p>
                            <label className="btn btn-outline-info">
                                Upload featured image
                                <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                            </label>
                        </p>
                    </div>
                </div>
                <div>
                    <h5>Categories</h5>
                    <hr/>
                    <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
                        {showCategories()}
                    </ul>
                </div>
                <div>
                    <h5>Tags</h5>
                    <hr/>
                    <ul style={{maxHeight: '200px', overflowY: 'scroll'}}>
                        {showTags()}
                    </ul>
                </div>
            </div>
        </div>
    </div>;
};

export default withRouter(CreateBlog);
