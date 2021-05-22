import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import M from 'materialize-css';

function Createpost() {

    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(function() {
        if(url) {
            fetch("/createpost", {
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then((res) => res.json())
            .then(function(data) {
                if(data.error) {
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else {
                    M.toast({html: "Created post Successfully", classes:"#43a047 green darken-1"})
                    history.push("/")
                }
            }).catch(function(error) {
                console.log(error)
            })
        }
        // eslint-disable-next-line
    }, [url])
    
    function postDetails() {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "itachi2000");
        fetch("https://api.cloudinary.com/v1_1/itachi2000/image/upload", {
            method:"post",
            body:data
        })
        .then((res) => res.json())
        .then(function(data) {
            setUrl(data.url);
        })
        .catch(function(error) {
            console.log(error);
        })
    }

    return (
        <div className="card input-field" style={{margin:"30px auto", maxWidth:"550px", padding:"20px", textAlign:"center"}}>
            <input type="text" placeholder="title" value={title} onChange={(event) => setTitle(event.target.value)}/>
            <input type="text" placeholder="body" value={body} onChange={(event) => setBody(event.target.value)}/>
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={(event) => setImage(event.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postDetails()}>
                Submit Post
            </button>
        </div>
    );
}

export default Createpost;