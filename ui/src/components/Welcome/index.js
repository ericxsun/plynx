// src/components/NotFound/index.js
import React, { Component } from 'react';
import { PlynxApi } from '../../API.js';
import LoadingScreen from '../LoadingScreen.js'
import { SPECIAL_USERS } from '../../constants.js';
import cookie from 'react-cookies'

import './style.css';

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    document.title = "Plynx";

    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.loginUser(SPECIAL_USERS.DEFAULT);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loginUser(specialUser) {
    // Loading

    var self = this;
    var loading = true;
    var sleepPeriod = 1000;
    const sleepMaxPeriod = 10000;
    const sleepStep = 1000;

    self.setState({
      loading: true,
    });

    var handleResponse = null;
    var promise = null;

    if (specialUser === SPECIAL_USERS.DEMO) {
      promise = PlynxApi.endpoints.demo.getCustom({
          method: 'post'
        });
      handleResponse = response => {
        cookie.save('access_token', response.data.access_token, { path: '/' });
        cookie.save('refresh_token', response.data.refresh_token, { path: '/' });
        cookie.save('username', response.data.username, { path: '/' });
        cookie.save('demoPreview', true, { path: '/' });
        window.location = '/graphs';
        loading = false;
      };
    } else if (specialUser === SPECIAL_USERS.DEFAULT) {
      promise = PlynxApi.endpoints.token.getCustom({
          method: 'get',
          auth:
                {
                  username: SPECIAL_USERS.DEFAULT,
                  password: ''
                }
        });
      handleResponse = response => {
        cookie.save('access_token', response.data.access_token, { path: '/' });
        cookie.save('refresh_token', response.data.refresh_token, { path: '/' });
        cookie.save('username', SPECIAL_USERS.DEFAULT, { path: '/' });
        //dispatch({ type: AUTH_USER });
        //window.location.href = CLIENT_ROOT_URL + '/dashboard';
        window.location = '/graphs';
      };
    }

    var errorHandler = (error) => {
      if (specialUser === SPECIAL_USERS.DEFAULT) {
        loading = false;
      }
      //errorHandler(dispatch, error.response, AUTH_ERROR)
    };

    while (loading) {
      await promise
      .then(handleResponse)
      .catch(errorHandler);
      if (loading) {
        await self.sleep(sleepPeriod);
        sleepPeriod = Math.min(sleepPeriod + sleepStep, sleepMaxPeriod);
      }
    }

    // Stop loading
    self.setState({
      loading: false,
    });
  }

  handleDemo() {
    console.log("Demo");
    this.loginUser(SPECIAL_USERS.DEMO);
  }

  render() {
    return (
      <div className='Welcome'>
        {this.state.loading &&
          <LoadingScreen />
        }
        <div className="Top">
          <video id="background-video" loop autoPlay>
            <source src="video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className='WelcomeBlock'>
          {!cookie.load('username') &&
            <div className="DemoButton" onClick={() => this.handleDemo()}>
              Try Live Demo
            </div>
          }
        </div>

        <div className="items">

          <div className="items-wrapper">

            <div className="item">
              <div className="header">
                Open Source
              </div>
              <div className="body">
                Apache License 2.0
              </div>
            </div>

            <div className="item">
              <div className="header">
                Reproducibility
              </div>
              <div className="body">
                Go back to your experiments and reproduce them
              </div>
            </div>

            <div className="item">
              <div className="header">
                Compatibility
              </div>
              <div className="body">
                Works with any language, library and user code
              </div>
            </div>

            <div className="item">
              <div className="header">
                Interactive interface
              </div>
              <div className="body">
                Interactive and user friendly UI
              </div>
            </div>

            <div className="item">
              <div className="header">
                python API
              </div>
              <div className="body">
                Create your complex pipelines using python script
              </div>
            </div>

            <div className="item">
              <div className="header">
                Scalability
              </div>
              <div className="body">
                Scale your cluster of workers. Designed to work on a single workstation and on a cluster with multiple nodes
              </div>
            </div>


            <div className="item">
              <div className="header">
                General
              </div>
              <div className="body">
                Designed to be a solution to many problems
              </div>
            </div>

            <div className="item">
              <div className="header">
                Shareable
              </div>
              <div className="body">
                Share your Machine Learning or Analytics pipeline across the organization
              </div>
            </div>

            <div className="item">
              <div className="header">
                Reusable
              </div>
              <div className="body">
                Each Operation and subgraph can be used in different projects
              </div>
            </div>

          </div>

        </div>

        <div className="footer">
          <div className="contact">
            <a href="https://github.com/khaxis/plynx">Github</a>
            <a href="mailto:ivan@plynx.com">Contact us</a>
          </div>
        </div>
      </div>
    );
  }
}
