import React from 'react';
import { Link, browserHistory } from 'react-router';
let classNames = require('classnames');

import { LegablyLargeFooter } from '../index';
import { constant, cookieManager, helper, utils } from '../../shared/index';
import ModalPopup from '../shared/modal-popup/ModalPopup';

export default class Home extends React.Component {
	constructor (props) {
    super(props);
    this.state = {
      email: '',
      emailError: '',
      emailValid: false,
      is_seeker_profile_completed: false,
      is_poster_profile_completed: false,
      modalPopupObj: {},
      scrollTop: 0
  	};
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
    this.onGetStartedKeyUp = this.onGetStartedKeyUp.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.moveToTop = this.moveToTop.bind(this);
  }

  componentDidMount () {
    var userData = utils.getCurrentUser();
    if (userData) {
      this.setState({
        is_seeker_profile_completed: userData.is_seeker_profile_completed,
        is_poster_profile_completed: userData.is_poster_profile_completed
      });
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    let target = event.srcElement || event.target;
    this.setState({
      scrollTop: target.body.scrollTop
    });
  }

  moveToTop() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top > 0) {
      window.scrollTo(0, top - 25);
      setTimeout(this.moveToTop, 5);
    }
  }

  changeUrl(url){
    browserHistory.push({
      pathname: url,
      state: { email: this.state.email }
    });
  }

  onGetStartedKeyUp(evt){
    if(evt.keyCode == 13 || evt.which == 13){
      this.handleClick();
    }
  }

  handleUserInput(e){
    this.setState({[e.target.name]: e.target.value});
  }

  handleInputOnBlur(e){
    this.setState({[e.target.name]: e.target.value});
    if(e.target.value){
      this.state.emailValid = e.target.value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
      this.state.emailError = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
      this.setState({emailError : this.state.emailError, emailValid: this.state.emailValid})
    }else{
      this.setState({emailError : constant.ENTER_EMAIL, emailValid: false})
    }
  }

  handleClick() {
    if (this.state.email) {
      this.state.emailValid = this.state.email.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
      this.state.emailError = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
      this.setState({emailError : this.state.emailError, emailValid: this.state.emailValid})
    } else {
      this.setState({emailError : constant.ENTER_EMAIL, emailValid: false})
    }

    if (this.state.emailValid) {
      this.changeUrl(constant['ROUTES_PATH']['SIGN_UP']);
    }
  }

  movePage(url) {
    let routesPath = constant['ROUTES_PATH'];
    if (url === routesPath['JOB_SEARCH']) {
      if (!this.state.is_seeker_profile_completed) {
        helper.openIncompleteProfilePopup(this, 'seeker');
        return;
      }
    } else if (url === routesPath['POST_JOB']) {
      if (!this.state.is_poster_profile_completed) {
        helper.openIncompleteProfilePopup(this, 'poster')
        return;
      }
    }
    utils.changeUrl(url);
  }

	render() {
    let routesPath = constant['ROUTES_PATH'];
    var partenerClass = classNames({
      'right-div col-sm-6': true,
      'col-sm-offset-3': this.props.session
    });

    let scrollClass = classNames({
      'move-to-top': true,
      'd-block': this.state.scrollTop > 350
    });

    return (
      <div className="bg-white">
        <div className="home-page-wrapper">
          <div className="banner">
            <div className="banner-content">
              <h4>FIND THE <span>BEST LEGAL JOB.</span> HIRE THE <span>BEST ATTORNEY.</span></h4>
              <p>Legably is the modern online legal staffing platform that connects attorneys seeking work with other attorneys and firms in need of their services.</p>
              {
                this.props.session ?
                  <div className="relative">
                    <button className="transy-btn mr-10" type="button" onClick={() => this.movePage(routesPath['POST_JOB'])}> Post a Job </button>
                    <button className="transy-btn" type="button" onClick={() => this.movePage(routesPath['JOB_SEARCH'])}> Find a Job </button>
                  </div>
                :
                  <div className="relative">
                    <div className={this.state.emailError !== '' ? "input-group global-error" : "input-group"}>
                      <input type="text" className="form-control" placeholder="Enter your email" name="email" value={this.state.email} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} onKeyUp={this.onGetStartedKeyUp}/>
                      <span className="input-group-btn">
                        <button className="btn btn-secondary" type="button" onClick={this.handleClick}>Get Started!</button>
                      </span>
                    </div>
                    <p className="error"><span>{this.state.emailError !== '' ? this.state.emailError : ''}</span></p>
                  </div>
              }
              {
                this.props.session ?
                  null
                :
                  <p>Already have a Legably account? <span onClick={() => this.changeUrl(routesPath['SIGN_IN'])}>Sign-In</span></p>
              }
            </div>
          </div>

          <section className="floating-section">
            <div className="floating-div row">
              <div className="row">
                <div className="col-sm-4">
                  <span className="icon">
                    <img src={constant['IMG_PATH'] + 'note-pad-oval.png'} alt="microscope" />
                  </span>
                  <h4>Work On Your Terms</h4>
                  <p>Legably gives attorneys seeking freelance (hourly- or project-based) work the opportunity to find great on-site and remote jobs that match their skill-set, interests, and availability. Whether you’re interested in working as a full-time freelancer or supplementing income from your existing position, Legably is the place to be.</p>
                </div>
                <div className="col-sm-4">
                  <span className="icon">
                    <img src={constant['IMG_PATH'] + 'join-hands.png'} alt="target" />
                  </span>
                  <h4>Connect Directly</h4>
                  <p>The Legably platform facilitates a direct connection between attorneys seeking work and attorneys and firms in need of their services—allowing both parties to get to work quickly and avoid the headaches, inefficiencies, and high-fees associated with traditional legal staffing agencies and hiring processes.</p>
                </div>
                <div className="col-sm-4">
                  <span className="icon">
                    <img src={constant['IMG_PATH'] + 'grow-img.png'} alt="edit-pad" />
                  </span>
                  <h4>Grow Your Practice</h4>
                  <p>Legably gives attorneys and firms the ability to handle more clients, generate more revenue, and grow their practices without the overhead and risk associated with hiring a full-time employee by providing access to on-demand services from highly skilled attorneys specializing in a wide-variety of practice areas across the U.S.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="how-it-works">
            <h3>HOW IT WORKS</h3>
            <div className="row list-wrapper">
              <div className="left-div col-sm-6">
                <h4>For Attorneys Seeking Work</h4>
                <div className="vr-saperator separator">
                  <div className="row mb-40 align-center">
                    <span className="circle col-xs-2">1</span>
                    <p className="col-xs-10 col-sm-9">Sign-up on the Legably platform for free and create your attorney profile. Add bar licensure info, practice area(s), preferred location(s), work history, and upload your resume and unlimited documents showcasing your work.</p>
                  </div>
                  <div className="row mb-40 align-center">
                    <span className="circle col-xs-2">2</span>
                    <p className="col-xs-10 col-sm-9">Search and apply for freelance jobs on Legably that match your skill-set, interests, availability, and desired compensation.</p>
                  </div>
                  <div className="row mb-40 align-center">
                    <span className="circle col-xs-2">3</span>
                    <p className="col-xs-10 col-sm-9">Leverage Legably’s direct-messaging features to negotiate terms and deliverables—and then, get to work!</p>
                  </div>
                  <div className="row mb-40 align-center">
                    <span className="circle col-xs-2">4</span>
                    <p className="col-xs-10 col-sm-9">Payment for services provided is facilitated by the Legably platform based on completion of agreed upon deliverables. </p>
                  </div>
                  <div className="row mb-40 align-center">
                    <span className="circle col-xs-2">5</span>
                    <p className="col-xs-10 col-sm-9">As you complete projects and work for various attorneys and firms your experience and value increases—opening the door to new opportunities.</p>
                  </div>
                </div>
              </div>
              <div className="right-div col-sm-6">
                <div className="row"><h4 className="col-sm-offset-1">For Hiring Attorneys and Firms</h4></div>
                <div className="row mb-40 align-center">
                  <span className="circle col-xs-2 col-sm-offset-1">1</span>
                  <p className="col-xs-10">Sign-up for free on the Legably platform and create your profile by providing us with some basic information about you or your firm.</p>
                </div>
                <div className="row mb-40 align-center">
                  <span className="circle col-xs-2 col-sm-offset-1">2</span>
                  <p className="col-xs-10">Post jobs for free in any practice area throughout the U.S. The process is quick and easy—we only need some basic information related to practice area, location, the legal work to be completed, rate, and whether you are seeking on-site or remote support.</p>
                </div>
                <div className="row mb-40 align-center">
                  <span className="circle col-xs-2 col-sm-offset-1">3</span>
                  <p className="col-xs-10">Accept and review qualified applicants or search for candidates that might be a good fit. Once you’ve identified your desired candidate, use our secure messaging system to negotiate a rate that works for both parties and agree on terms, timing, and deliverables—then get to work and grow your practice!</p>
                </div>
                <div className="row mb-40 align-center">
                  <span className="circle col-xs-2 col-sm-offset-1">4</span>
                  <p className="col-xs-10">Payment for services provided is facilitated by the Legably platform. </p>
                </div>
              </div>
            </div>
          </section>

          <section className="get-started">
            <div className="row">
              { !this.props.session ?
                <div className="left-div col-sm-6">
                  <div className="row vr-saperator separator mr-0">
                    <div className="col-sm-10 p-0">
                      <h4>Get Started Today</h4>
                      <p>Sign-up today for free and start exploring great opportunities or finding the attorneys you need to grow your practice. </p>
                      <button type="button" onClick={() => this.changeUrl(routesPath['SIGN_UP'])}>Get Started!</button>
                    </div>
                  </div>
                </div>
                : ''
              }

              <div className={partenerClass}>
                <div className="row mr-0">
                  <div className="col-sm-10 col-sm-offset-1 p-0">
                    <h4>PARTNERS</h4>
                    <p>Legably is the preferred legal staffing solution for users of Clio, a leading global legal practice management software provider. </p>
                    <Link><img src="images/legably-partner-responsive.png" alt="legably" /></Link>
                    <span>+</span>
                    <Link><img src="images/clio-logo-responsive.png" /></Link>
                  </div>
                </div>
              </div>
            </div>
            <a className={scrollClass} onClick={this.moveToTop} href="javascript:void(0)">
              <i className="fa fa-long-arrow-up" aria-hidden="true"></i>
            </a>
          </section>

          <ModalPopup modalPopupObj={this.state.modalPopupObj} />
        </div>
        {!this.props.session && <LegablyLargeFooter />}
      </div>
    );
  }
}
