import Section from 'shared/components/section/section';
import React, { Component } from 'react';
import Form from 'shared/components/form/form';
import axios from 'axios';
import PropTypes from 'prop-types';
import config from 'config/environment';
import _ from 'lodash';
import * as CookieHelpers from 'shared/utils/cookieHelper';
import FormEmail from 'shared/components/form/formEmail/formEmail';
import FormInput from 'shared/components/form/formInput/formInput';
import FormButton from 'shared/components/form/formButton/formButton';
import styles from './login.css';

require('./login.css');
const queryString = require('query-string');

class Login extends Component {

  state = {
    email: '',
    emailValid: false,
    password: '',
    passwordValid: false,
    authenticated: false,
    error: '',
    sso: null,
    sig: null,
    ssoParamsPresent: false
  }

  componentDidMount = () => {
    this.checkForSsoParams();
  }

  onEmailChange = (value, valid) => {
    this.setState({ email: value, emailValid: valid });
  }

  onPasswordChange = (value, valid) => {
    this.setState({ password: value, passwordValid: valid });
  }

  setSsoParams = () => {
    const parsed = queryString.parse(location.search);

    if (this.state.ssoParamsPresent) {
      this.state.sso = parsed.sso;
      this.state.sig = parsed.sig;
    }
  }

  checkForSsoParams = () => {
    const parsed = queryString.parse(location.search);

    if (parsed.sso && parsed.sig) { this.setState({ ssoParamsPresent: true }); }
  }

  isFormValid = () => this.state.emailValid && this.state.passwordValid

  // This is a temp function to ensure we return a URL if the changes to the API
  // aren't in place. It can be removed after operationcode_backend#91 has been deployed
  resolveRedirectUrl = (redirectUrl) => {
    if (redirectUrl) { return redirectUrl; }
    return '/profile';
  }

  handleOnClick = (e) => {
    e.preventDefault = true;
    this.setSsoParams();

    if (this.isFormValid()) {
      axios.post(`${config.backendUrl}/sessions`, {
        user: {
          email: this.state.email,
          password: this.state.password,
        },
        sso: this.state.sso,
        sig: this.state.sig
      }).then(({ data }) => {
        CookieHelpers.setUserAuthCookie(data);
        this.setState({ authenticated: true });
        this.props.updateRootAuthState((history) => {
          if (this.state.ssoParamsPresent) {
            window.location = data.redirect_to;
          } else {
            history.push(this.resolveRedirectUrl(data.redirect_to));
          }
        });
      }).catch((response) => {
        const error = _.get(response, 'message');
        this.setState({ error });
      });
    }
  }

  render() {
    const { error } = this.state;

    return (
      <Section title="Login" theme="white">
        <Form autoComplete>
          <FormEmail displayName="Email" label="Email" onChange={this.onEmailChange} />
          <FormInput displayName="Password" label="Password" inputType="password" onChange={this.onPasswordChange} />
          {error && <h2 className={styles.loginError}>Login Error: {error}</h2>}
          <FormButton className={styles.Button} text="login" onClick={this.handleOnClick} />
        </Form>
      </Section>
    );
  }
}


Login.propTypes = {
  updateRootAuthState: PropTypes.func
};

Login.defaultProps = {
  updateRootAuthState: () => {}
};

export default Login;
