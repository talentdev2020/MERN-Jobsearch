import React from 'react';
import { Link } from 'react-router';
let classNames = require('classnames');

import { constant, utils } from '../../../shared/index';
import { Applied, Interviewing, NegotiatingTerms, StartPending, InProgress, JobComplete } from './steps/index';

export default class JobStepsView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      step: props.step || constant['JOB_STEPS']['APPLIED'],
      highestStep: props.step || constant['JOB_STEPS']['APPLIED'],
      stepRelatedData: props.stepRelatedData || [],
      declinedCandidateList: props.declinedCandidateList || [],
      jobType: props.jobType || '',
      paymentType: props.paymentType || '',
      userId: props.userId || ''
    }
    this.handler = this.handler.bind(this);
    this.getStepData = this.getStepData.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      step: props.step,
      highestStep: props.step,
      stepRelatedData: props.stepRelatedData,
      declinedCandidateList: props.declinedCandidateList,
      jobType: props.jobType,
      paymentType: props.paymentType,
      userId: props.userId
    });
  }

  handler(action, newHighestStep) {
    if (action < 0) {
      if (this.props.role === constant['ROLE']['SEEKER']) {
        this.setState({
          step: action,
          highestStep: action
        });
      } else {
        if (newHighestStep < this.state.highestStep) {
          let hStep = newHighestStep;
          if (newHighestStep < 0) {
            hStep = constant['JOB_STEPS']['APPLIED'];
          }

          if (action !== (constant['JOB_STEPS']['APPLIED'] * -1)) {
            setTimeout(() => {
              this.getStepData(this.props.jobId, hStep, this.props.role, true);
            }, 0);
          } else {
            this.setState({
              step: hStep,
              highestStep: hStep
            });
          }
        }
      }
    } else {
      if (newHighestStep > this.state.highestStep) {
        if (this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee' && newHighestStep == constant['JOB_STEPS']['IN_PROGRESS']) {
          this.setState({
            highestStep: newHighestStep,
            step: newHighestStep
          });
          this.getStepData(this.props.jobId, newHighestStep, this.props.role, true);
        } else {
          this.setState({
            highestStep: newHighestStep
          });
        }
      }
    }
  }

  getStepData(jobId, step, userRole, isCallFromHandler) {
    let that = this;
    let req = {
      job_id: jobId,
      step: step,
      highestStep: that.state.highestStep,
      user_role: userRole
    }

    utils.apiCall('GET_STEP_DATA', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Step Data');
        utils.logger('error', 'Get Step Data Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          that.setState({
            step: step,
            highestStep: (isCallFromHandler === true) ? step : that.state.highestStep,
            stepRelatedData: utils.getDataFromRes(response, 'step_data'),
            declinedCandidateList: utils.getDataFromRes(response, 'declined_candidates') || []
          }, function() {
            (isCallFromHandler === true) && window.scroll(0, 0);
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  gotoJobCompleteStep(step) {
    utils.loader('start');
    setTimeout(() => {
      this.setState({
        step: step,
        highestStep: step,
        stepRelatedData: [],
        declinedCandidateList: []
      }, function() {
        window.scroll(0, 0);
        utils.loader('stop');
      });
    }, 500);
  }

  render() {
    let absStepVal = Math.abs(this.state.step);
    let absHighestStep = Math.abs(this.state.highestStep);
    let jobSteps = constant['JOB_STEPS'],
    step_101 = jobSteps['APPLIED'],
    step_102 = jobSteps['INTERVIEWING'],
    step_103 = jobSteps['N_TERMS'],
    step_104 = jobSteps['S_PENDING'],
    step_105 = jobSteps['IN_PROGRESS'],
    step_106 = jobSteps['J_COMPLETE'];

    let case_101 = classNames({
      'fill': absHighestStep >= step_101,
      'active': absStepVal === step_101,
      'disabled-element': (absStepVal === step_101 || absHighestStep < step_101)
    });

    let case_102 = classNames({
      'fill': absHighestStep >= step_102,
      'active': absStepVal === step_102,
      'disabled-element': (absStepVal === step_102 || absHighestStep < step_102)
    });

    let case_103 = classNames({
      'fill': absHighestStep >= step_103,
      'active': absStepVal === step_103,
      'disabled-element': (absStepVal === step_103 || absHighestStep < step_103)
    });

    let case_104 = classNames({
      'fill': absHighestStep >= step_104,
      'active': absStepVal === step_104,
      'disabled-element': (absStepVal === step_104 || absHighestStep < step_104)
    });

    let case_105 = classNames({
      'fill': absHighestStep >= step_105,
      'active': absStepVal === step_105,
      'disabled-element': (absStepVal === step_105 || absHighestStep < step_105)
    });

    let case_106 = classNames({
      'fill': absHighestStep >= step_106,
      'active': absStepVal === step_106,
      'disabled-element': (absStepVal === step_106 || absHighestStep < step_106)
    });

    return (
      <div>
        <div className="bg-white widget-wrapper clearfix">
          <section className="steps-widget">
            <div className="board-inner">
              <ul className="nav nav-tabs" id="myTab">
                <div className="liner"></div>
                <li className={case_101}>
                  <Link>
                    <span className="round-tabs one" onClick={this.getStepData.bind(this, this.props.jobId, step_101, this.props.role, false)}></span>
                  </Link>
                  <span>{this.props.role === 'seeker' ? 'Applied' : 'Candidates'}</span><span></span>
                </li>
                <li className={case_102}>
                  <Link>
                    <span className="round-tabs tow" onClick={this.getStepData.bind(this, this.props.jobId, step_102, this.props.role, false)}></span>
                  </Link>
                  <span>Interviewing</span><span></span>
                </li>
                <li className={case_103}>
                  <Link>
                    <span className="round-tabs three" onClick={this.getStepData.bind(this, this.props.jobId, step_103, this.props.role, false)}></span>
                  </Link>
                  <span>Negotiating Terms</span><span></span>
                </li>
                <li className={case_104}>
                  <Link>
                    <span className="round-tabs four" onClick={this.getStepData.bind(this, this.props.jobId, step_104, this.props.role, false)}></span>
                  </Link>
                  <span>Start Pending</span><span></span>
                </li>
                <li className={case_105}>
                  <Link>
                    <span className="round-tabs five" onClick={this.getStepData.bind(this, this.props.jobId, step_105, this.props.role, false)}></span>
                  </Link>
                  <span>In Progress</span><span></span>
                </li>
                <li className={case_106}>
                  <Link>
                    <span className="round-tabs six" onClick={this.gotoJobCompleteStep.bind(this, step_106)}></span>
                  </Link>
                  <span>Job Complete</span><span></span>
                </li>
              </ul>
            </div>
          </section>
          <div>
            {{
              101: <Applied role={this.props.role} stepRelatedData={this.state.stepRelatedData} declinedCandidateList={this.state.declinedCandidateList} jobId={this.props.jobId} step={this.state.step} highestStep={this.state.highestStep} handler={this.handler} />,
              102: <Interviewing role={this.props.role} stepRelatedData={this.state.stepRelatedData} jobId={this.props.jobId} step={this.state.step} highestStep={this.state.highestStep} handler={this.handler} freezeActivity={this.props.freezeActivity} />,
              103: <NegotiatingTerms jobType={this.state.jobType} paymentType={this.state.paymentType} role={this.props.role} stepRelatedData={this.state.stepRelatedData[0] || {}} jobId={this.props.jobId} step={this.state.step} highestStep={this.state.highestStep} handler={this.handler}/>,
              104: <StartPending jobType={this.state.jobType} paymentType={this.state.paymentType} role={this.props.role} stepRelatedData={this.state.stepRelatedData[0] || {}} jobId={this.props.jobId} step={this.state.step} highestStep={this.state.highestStep} handler={this.handler} freezeActivity={this.props.freezeActivity} userId={this.props.userId}/>,
              105: <InProgress jobType={this.state.jobType} paymentType={this.state.paymentType} role={this.props.role} stepRelatedData={this.state.stepRelatedData} jobId={this.props.jobId} step={this.state.step} highestStep={this.state.highestStep} handler={this.handler} />,
              106: <JobComplete role={this.props.role} stepRelatedData={this.state.stepRelatedData} jobId={this.props.jobId}/>
            }[absStepVal]}
          </div>
        </div>
      </div>
    );
  }
}
