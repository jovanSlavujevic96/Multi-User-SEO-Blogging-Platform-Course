import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth, updateUser } from '../../actions/auth';
import { getProfile, updateProfile } from '../../actions/user';
import { initScriptLoader } from 'next/script';
import { API } from '../../config';

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        password: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        photoName: '', // final username
        userData: typeof window !== 'undefined' && new FormData(),
    });

    const token = getCookie('token');
    const {username, name, email, about, password, error, success, loading, photo, photoName, userData} = values;

    const init = () => {
        getProfile(token).then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    about: data.about,
                    photoName: data.username
                });
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => e => {
        const value = (name === 'photo') ? e.target.files[0] : e.target.value;
        userData.set(name, value);
        setValues({...values, [name]: value, error: false, success: false})
    };

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, loading: true});
        updateProfile(token, userData).then(data => {
            if (data.error) {
                setValues({...values, error: data.error, success: false, loading: false});
            } else {
                updateUser(data, () => {
                    setValues({...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        success: true,
                        loading: false,
                        userData: new FormData(),
                        photoName: data.username
                    });
                });
            }
        });
    };

    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label className='btn btn-outline-info'>
                    Profile Photo
                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                </label>
            </div>

            <div className='form-group'>
                <label className='text-muted'>Username</label>
                <input onChange={handleChange('username')} type="text" value={username} className='form-control'/>
            </div>

            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input onChange={handleChange('name')} type="text" value={name} className='form-control'/>
            </div>

            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input onChange={handleChange('email')} type="email" value={email} className='form-control'/>
            </div>

            <div className='form-group'>
                <label className='text-muted'>About</label>
                <textarea onChange={handleChange('about')} type="text" value={about} className='form-control'/>
            </div>

            <div className='form-group'>
                <label className='text-muted'>Password</label>
                <input onChange={handleChange('password')} placeholder="password" type="password" className='form-control'/>
            </div>

            <button type="submit" className='btn btn-primary'>
                Submit
            </button>
        </form>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
            Profile updated
        </div>
    );

    const showLoading = () => (
        <div className='alert alert-info' style={{display: loading ? '' : 'none'}}>
            Loading...
        </div>
    );

    return (
        <React.Fragment>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-4'>
                        <img
                            src={`${API}/user/photo/${photoName}`}
                            className="img img-fluid img-thumbnail mb-3"
                            style={{maxHeight: 'auto', maxWidth: '100%'}}
                            alt='user profile'
                        />
                    </div>
                    <div className='col-md-8 mb-5'>
                        {showSuccess()}
                        {showError()}
                        {showLoading()}
                        {profileUpdateForm()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProfileUpdate;
