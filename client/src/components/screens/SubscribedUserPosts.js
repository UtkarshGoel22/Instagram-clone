import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom';

function Home() {

    const [data, setData] = useState([]);
    // eslint-disable-next-line
    const {state, dispatch} = useContext(UserContext);

    useEffect(function() {
        fetch('/getsubpost', {
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(function(result) {
            setData(result.posts)
        })
    }, [])

    const likePost = function(id) {
        fetch('/like', {
            method:"put",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(function(result) {
            // console.log(result)
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result;
                }else {
                    return item;
                }
            })
            setData(newData)
        }).catch(function(error) {
            console.log(error);
        })
    }

    const unlikePost = function(id) {
        fetch('/unlike', {
            method:"put",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
        }).then(res => res.json())
        .then(function(result) {
            // console.log(result)
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result;
                }else {
                    return item;
                }
            })
            setData(newData)
        }).catch(function(error) {
            console.log(error);
        })
    }

    const makeComment = function(text, postId) {
        fetch('/comment', {
            method:"put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(function(result) {
            console.log(result)
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result;
                }else {
                    return item;
                }
            })
            setData(newData)
        }).catch(function(error) {
            console.log(error)
        })
    }

    const deletePost = function(postid) {
        fetch(`/deletepost/${postid}`, {
            method:"delete",
            headers: {
                Authorization:"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(function(result) {
            console.log(result)
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"6px"}}><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> { 
                                item.postedBy._id === state._id  
                                && <i className="material-icons" style={{float:"right"}}
                                onClick={() => deletePost(item._id)}>delete</i>
                                }
                            </h5>
                            <div className="card-image">
                                <img src={item.photo} alt={""}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {
                                    item.likes.includes(state._id) ? 
                                    <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                                    : <i className="material-icons" onClick={()=>{likePost(item._id)}}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}>
                                                <span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text} 
                                                {
                                                    record.postedBy._id === state._id  
                                                    && <i className="material-icons" style={{float:"right"}}>delete</i>
                                                }
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    makeComment(event.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment"/>
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home;

// onClick={() => deleteComment(item.comments._id)}