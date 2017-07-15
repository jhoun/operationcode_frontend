import React, { Component } from 'react';
import Section from 'shared/components/section/section';
// import styles from './press.css';


class Press extends Component {
  render() {
    return (
      <div>
        <Section title="Press" theme="white" >
          <p>
            We are a decentralized community of hard-working volunteers, and we love hearing feedback, comments, and suggestions. Feel free to send us an e-mail, or even mail a letter.
            <br />
            <br />
            The best way to reach our staff and our members is by joining Operation Code to receive an invite to our Slack team..
          </p>
        </Section>
      </div>
    );
  }
}

export default Press;
