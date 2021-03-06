import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App'

function Profile() {

    const [mypics, setMypics] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [image, setImage] = useState("");

    useEffect(function() {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(function(result) {
            setMypics(result.mypost)
        })
    }, [])

    useEffect(function() {
        if(image) {
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
                
                // localStorage.setItem("user", JSON.stringify({...state, pic:data.url }))
                // dispatch({type:"UPDATEPIC", payload:"data.url"})
                fetch('/updatepic', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic: data.url
                    })
                }).then(res =>res.json())
                .then(function(result) {
                    console.log(result)
                    localStorage.setItem("user", JSON.stringify({...state, pic:result.pic }))
                    dispatch({type:"UPDATEPIC", payload:"result.pic"})
                })
                // window.location.reload()
            })
            .catch(function(error) {
                console.log(error);
            })
        }
        // eslint-disable-next-line
    }, [image])

    const updatePhoto = function(file) {
        setImage(file)     
    }

    return (
        <div style={{maxWidth:"650px", margin:"0px auto"}}>
            <div style={{
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                }}>
                    <div>
                        <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                            src={state?state.pic:"loading"}
                            alt={""}
                        />
                    </div>
                    
                    <div>
                        <h4>{state?state.name:"loading"}</h4>
                        <h5>{state?state.email:"loading"}</h5>
                        <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state?state.followers.length:0} followers</h6>
                            <h6>{state?state.following.length:0} following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update Pic</span>
                        <input type="file" onChange={(event) => updatePhoto(event.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>

            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile;