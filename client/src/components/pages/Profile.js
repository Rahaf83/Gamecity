import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../../actions/index";
import { useParams } from "react-router-dom";
//import { storage } from "../firebase/index"
function Profile({ userData, fetchUser, logOut }) {
  // const [image , setImage]= useState(null);
  // const [url , setURL]= useState(null);
  let {email}= useParams();

  useEffect(() => {
    fetchUser(email);
  }, [email, fetchUser]);

  //  function handleChange(e)  {
  //    if(e.target.files[0]){
  //    }
  //  }

  return userData.loading ? (
    <h2 style={{ marginTop: "20px" }}>Loading</h2>
  ) : userData.error ? (
    <h2 style={{ marginTop: "20px" }}>{userData.error}</h2>
  ) : (
    <div style={{ marginTop: "20px" }}>
      <h2>User Information</h2>
      <div>
        <hr></hr>
        {userData && userData.user && (
          <ul>
            <li>Username: {userData.user.username}</li>
            <li>First name: {userData.user.firstName}</li>
            <li>Last name: {userData.user.lastName}</li>
            <li>Email: {userData.user.email}</li>
            <li>City: Jordan/{userData.user.city}</li>
            <li>Phone Number: {userData.user.phoneNo}</li>
            <li>Birthday: {userData.user.birthday}</li>
            <li>UserID: {userData.user._id}</li>
          </ul>
        )}
        {/* <label>Add Image </label>
  <input type="file" onChange="handleChange()"/>
  <button onClick = "handleUpload()">Upload</button> */}
        {/* <br />
  <img width="50px" src = {this.state.url || "http://via.placeholder.com/100x150"} alt = "firebase-image" />
  <button type="submit" value = "Submit" onClick = {this.onSubmit}>Submit</button> */}

        {/*   
        <Link
          to={{ pathname: `/profile/${fetchUser._id}/edit` }}
          className="btn btn-info"
        >
          Edit
        </Link> */}
        {/* <button onClick = {() => logOut()}> logOut</button> */}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userData: state.user,
    email: window.localStorage.email,
    id: window.localStorage.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: (email) => dispatch(fetchUser(email)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
