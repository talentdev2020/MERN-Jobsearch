import React from 'react';

export default class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.popupObj = this.props.popupObj;
  }

  onYesBtnClick() {
    if(this.popupObj.yesBtnAction) {
      this.popupObj.yesBtnAction();
    }
  }

  onNoBtnClick() {
    if(this.popupObj.noBtnAction) {
      this.popupObj.noBtnAction();
    }
  }

  getIconImage() {
    return (
      this.popupObj.iconImgUrl ?
        <div className="icon mb-30">
          <img src={this.popupObj.iconImgUrl} />
        </div>
      :
        null
    )
  }

  getMessage() {
    let msgArr = [];
    let message = this.popupObj.msg;

    if (!!message) {
      let dynamicContent = this.popupObj.dynamicContent;
      if (dynamicContent && dynamicContent.length) {
        dynamicContent.map((obj) => {
          let regExp = new RegExp('{' + obj['key'] + '}', 'g');
          message = message.replace(regExp, obj['value']);
        });
      }

      msgArr = message.split('\n');
    }

    return (
      msgArr.length ?
        msgArr.map((msg, index) => <p className="modal-para" key={index} dangerouslySetInnerHTML={{__html: msg}}></p>)
      :
        null
    )
  }

  render() {
    return (
      <div className="alert-modal">
        <div className={this.popupObj.alignTextLeft ? "modal-body align-left" : "modal-body"}>
          {
            this.getIconImage()
          }
          {
            this.getMessage()
          }
        </div>
        <div className="modal-footer">
          <button className={(this.popupObj.noBtnText === 'Cancel') ? 'btn-negative btn pull-left' : 'btn-no btn pull-left'} onClick={() => this.onNoBtnClick()}>{this.popupObj.noBtnText || 'No'}</button>
          <button className="btn-primary btn pull-right" onClick={() => this.onYesBtnClick()}>{this.popupObj.yesBtnText || 'Yes'}</button>
        </div>
      </div>
    )
  }
}
