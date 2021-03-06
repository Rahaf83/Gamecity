import React, { Component } from "react";

export default class SearchForm extends Component {
  
  searchHandler = (e) => {
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        if (window.find(e.target.value) === false) {
          alert(e.target.value + " does not exist in this page!");
        } else {
          window.find(e.target.value);
        }
      }
    });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          className="nav-item"
          name="searchText"
          placeholder="Search.. "
          onClick={this.searchHandler}
        />
      </div>
    );
  }
}

