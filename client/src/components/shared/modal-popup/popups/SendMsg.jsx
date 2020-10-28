import React from 'react';

import { constant, helper } from '../../../../shared/index';
import DragDropFile from '../drag-drop-file/DragDropFile';

export default class SendMsg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      msg: '',
      formErrors: {subject: false, msg: false, fileErr: false},
      formValid: true,
      file: {},
      fileErr: 'no',
      fileErrMsg: ''
    };
    this.popupObj = this.props.popupObj;
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handler = this.handler.bind(this);
  }

  onYesBtnClick() {
    this.validateForm(() => {
      if(this.popupObj.yesBtnAction && this.state.formValid) {
        // let msg = this.state.msg;
        // msg = msg.replace(/\n\r?/g, '<br />');
        this.popupObj.yesBtnAction(this.state.subject, this.state.msg, this.state.file);
      }
    });
  }

  onNoBtnClick() {
    if(this.popupObj.noBtnAction) {
      this.popupObj.noBtnAction();
    }
  }

  handleChange(e) {
    let name = e.target.name;
    this.setState({
      [name]: e.target.value
    }, function() {
      let val = this.state[name];
      if (val.length <= 1) {
        this.validateField(name, val);
      }
    });
  }

  handleBlur(e) {
    let name = e.target.name;
    let val = this.state[name];
    !!val && (val = val.trim());
    this.validateField(name, val);
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    if (fieldValidationErrors.hasOwnProperty(fieldName)) {
      fieldValidationErrors[fieldName] = false;
      if (!value) {
        fieldValidationErrors[fieldName] = true;
      }

      this.setState({
        formErrors: fieldValidationErrors,
        formValid: !fieldValidationErrors[fieldName]
      });
    }
    this.setState({
      [fieldName]: value,
    });
  }

  validateFields(callback) {
    let fieldValidationErrors = this.state.formErrors;
    for (let key in this.state.formErrors) {
      let val = this.state[key];
      !!val && (val = val.trim());
      fieldValidationErrors[key] = false;
      if (!val) {
        fieldValidationErrors[key] = true;
      }

      this.setState({
        [key]: val
      });
    }
    this.setState({
      formErrors: fieldValidationErrors
    }, callback);
  }

  validateForm(callback) {
    this.validateFields(() => {
      let formValid = true;
      for (let key in this.state.formErrors) {
        if (this.state.formErrors[key]) {
          formValid = false;
          break;
        }
      }
      this.setState({formValid: formValid}, callback);
    });
  }

  handler(err, file) {
    let formErrObj = this.state.formErrors,
    fileErr = 'no',
    fileErrMsg = '';
    formErrObj['fileErr'] = false;

    if (err) {
      formErrObj['fileErr'] = true;
      fileErr = '';
      fileErrMsg = err[0]['msg'];
    }
    this.setState({
      formErrors: formErrObj,
      fileErrMsg: fileErrMsg,
      fileErr: fileErr,
      file: file || {}
    });
  }

  render() {
    return (
      <div className="send-msg-modal">
        <div className="modal-header text-center p-20 m-0">Send Message to
          {
            this.popupObj.role === constant['ROLE']['SEEKER'] ?
              ' Hiring Manager'
            :
              ' Candidate'
          }
        </div>
        <div className="modal-body m-0">
          <form>
            <div className={this.state.formErrors.subject === true ? 'form-group m-0 global-error' : 'form-group m-0'}>
              <input type="text" name="subject" className="form-control" placeholder="Your Subject..."
                value={this.state.subject}
                onBlur={this.handleBlur}
                onChange={this.handleChange} />
              {
                this.state.formErrors.subject === true ?
                  <p>
                    <span>{helper.getValidationMsg('REQUIRED_FIELD', {'fieldName': constant['VALIDATION_MSG']['FIELDS_NAME']['SUBJECT']})}</span>
                  </p>
                :
                  null
              }
            </div>
            <div className={this.state.formErrors.msg === true ? 'form-group m-0 global-error' : 'form-group m-0'}>
              <textarea name="msg" className="full-width mt-20" rows="7" placeholder="Your Message..."
                value={this.state.msg}
                onBlur={this.handleBlur}
                onChange={this.handleChange}>
              </textarea>
              {
                this.state.formErrors.msg === true ?
                  <p>
                    <span>{helper.getValidationMsg('REQUIRED_FIELD', {'fieldName': constant['VALIDATION_MSG']['FIELDS_NAME']['MSG']})}</span>
                  </p>
                :
                  null
              }
            </div>
            <div className={this.state.formErrors.fileErr === true ? 'form-group m-0 global-error' : 'form-group m-0'}>
              <DragDropFile handler={this.handler} title="Attach File (Optional)" desc="Attach a file by clicking and selecting a file OR dragging & dropping a file to this area (use ZIP compression for multiple files)" />
              {
                this.state.formErrors.fileErr === true ?
                  <p className="pull-left mt-10">
                    <span className="m-0">{this.state.fileErrMsg}</span>
                  </p>
                :
                  null
              }
            </div>
            <span className="clearfix"></span>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn-negative btn pull-left" onClick={() => this.onNoBtnClick()}>Cancel</button>
          <button className="btn-primary btn pull-right" onClick={() => this.onYesBtnClick()}>Send Message</button>
        </div>
      </div>
    )
  }
}
