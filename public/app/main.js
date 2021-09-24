/* global m */

import { isAuthed } from './services/auth.js';
import { FarmList } from './views/farms.js';
import { LoginForm } from './views/login.js';

const App = {
  view() {
    return m('.container-lg', [
      isAuthed()
        ? m(FarmList)
        : m(LoginForm),
    ])
  }
}

const rootNode = document.getElementById('app');
m.mount(rootNode, App);
