/* global m */

import { LabeledInput } from '../components/forms.js';
import { api } from '../services/api.js';
import { setAuth } from '../services/auth.js';

export const LoginForm = {
  view({ state }) {
    const {
      signupUsername,
      signupPassword,
      loginUsername,
      loginPassword,
    } = state;

    const onSignup = async () => {
      try {
        await api.post('/users', {
          username: signupUsername,
          password: signupPassword,
        });
        setAuth(signupUsername, signupPassword);
      } catch (_) {
        state.signupUsername = '';
        state.signupPassword = '';
        m.redraw();
      }
    };

    const onLogin = () => {
      setAuth(loginUsername, loginPassword);
    };

    return m('.row', [
      m('.col-6.mt-3',
        m('h3', 'Existing Farmers'),
        m(LabeledInput, {
          id: 'login-username',
          label: 'Username',
          value: loginUsername,
          onValue: val => { state.loginUsername = val; },
        }),
        m(LabeledInput, {
          id: 'login-password',
          label: 'Password',
          type: 'password',
          value: loginPassword,
          onValue: val => { state.loginPassword = val; },
        }),
        m('button.btn.btn-primary', { onclick: onSignup }, 'Login'),
      ),

      m('.col-6.mt-3',
        m('h3', 'New Farmers'),
        m(LabeledInput, {
          id: 'signup-username',
          label: 'Username',
          value: signupUsername,
          onValue: val => { state.signupUsername = val; },
        }),
        m(LabeledInput, {
          id: 'signup-password',
          label: 'Password',
          type: 'password',
          value: signupPassword,
          onValue: val => { state.signupPassword = val; },
        }),
        m('button.btn.btn-primary', { onclick: onSignup }, 'Sign Up'),
      ),
    ]);
  }
};
