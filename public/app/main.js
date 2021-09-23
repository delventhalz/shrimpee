/* global m */

import { isAuthed } from './services/auth.js';
import { LoginForm } from './views/login.js';

const App = {
  view() {
    return m('.container-lg', [
      isAuthed()
        ? m('h1.display-1', 'Hello, Shrimpee!')
        : m(LoginForm),
    ])
  }
}

const rootNode = document.getElementById('app');
m.mount(rootNode, App);
