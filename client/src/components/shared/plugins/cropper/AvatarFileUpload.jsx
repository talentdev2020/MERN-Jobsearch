import React from "react";
import ReactDom from "react-dom";

var AvatarFileUpload = React.createClass({

  handleFile: function(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    if (!file || !file.name) return;

    if (!(/\.(jpg|jpeg|png)$/i).test(file.name.toLowerCase())) {
      return;
    }

    reader.onload = function(img) {
      ReactDom.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result, file);
    }.bind(this);
    reader.readAsDataURL(file);
  },

  render: function() {
    return (
      <input ref="in" type="file" accept="image/jpg, image/jpeg, image/png" onChange={this.handleFile} title=" " />
    );
  }
});

module.exports = AvatarFileUpload;
