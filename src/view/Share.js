import React, { useState } from "react";
import "../assets/css/share.css";
import { useHistory } from "react-router-dom";
import Navi from "../components/Login";
import { useAlert } from 'react-alert'

export default function Share(props) {
  const [videoUrl, setVideoUrl] = useState({});
  const history = useHistory();

  const alert = useAlert()

  const handleOnsubmit = async e => {
    e.preventDefault();
    const obj = videoUrl.video_url;
    const video_id = obj && obj.substring(obj.lastIndexOf("=") + 1);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${process.env.REACT_APP_API_KEY}&part=snippet`
    );
    const data = await res.json();
    if (data.items[0] === undefined) {
      alert.show("Please Click Share Button at Youtube Channel",{
        type:'info',
        timeout:5000
      })
    }
    else {

      const data_video = {
        title: data.items[0].snippet.title,
        description: data.items[0].snippet.description,
        poster: localStorage.getItem("name"),
        video_url: data.items[0].id
      };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/video`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${props.token}`
        },
        body: JSON.stringify(data_video)
      });
      const gdata = await response.json();
      if (gdata.state === "success") {
        history.push("/");
        alert.show("Added New Video Success",{
          type:'success'
        });
      }
      if (gdata.state==="existUrl"){
        alert.show("This Video Share Has Existed, Pls Try Other",{
          type:'info'
        })
      }
    }

  };

  if (!props.user) return <div>Error</div>;
  return (
    <div>
      <Navi user={props.user} setUser={props.setUser} />


      <div className="container wrapper-share">
        <form onSubmit={handleOnsubmit}>
          <fieldset>
            <legend className="ml-2 title-share">Share a Youture movie:</legend>
            <div className="share-input p-4">
              <span>Youtube URL:</span>
              <span className="ml-2 input-shareurl">
                <input
                  type="text"
                  name="video_url"
                  onChange={e =>
                    setVideoUrl({ ...videoUrl, video_url: e.target.value })
                  }
                  style={{ width: "100%" }}
                />
                <br />
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-2"
                >
                  Share
                </button>
              
              </span>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
