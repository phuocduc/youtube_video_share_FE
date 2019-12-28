import React, { useState, useEffect } from "react";
import "../assets/css/home.css";
import Navi from "../components/Login";

export default function Home(props) {
  const [video_info, setvideo_info] = useState([]);
  const get_video = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/videos`, {
      method: "GET",
      headers: {
        Authorization: `Token ${props.token}`
      }
    });
    const data = await res.json();
    setvideo_info(data.videos);
  };

  useEffect(() => {
    get_video();
  }, []);

  return (
    <div>
      <Navi setUser={props.setUser} user={props.user}/>
      <div className="d-flex justify-content-center align-items-center flex-column mb-5 mt-5">
        {video_info &&
          video_info.map(video => {
            return (
              <div
                key={video.id}
                className="container d-flex justify-content-around row mt-3"
              >
                <div className="col-12 col-md-5 d-flex justify-content-center">
                  <iframe
                    allowFullScreen="allowFullScreen"
                    src={`https://www.youtube.com/embed/${video.video_url}`}
                  ></iframe>
                </div>
                <div className="col-12 col-md-6">
                  <h5>{video.title}</h5>
                  <p>Shared by: {video.poster}</p>
                  <i className="fa fa-hand-o-up mr-2"></i>
                  <i className="fa fa-hand-o-down"></i>
                  <div>Description:</div>{" "}
                  <p className="text-overflow-1">{video.description}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
