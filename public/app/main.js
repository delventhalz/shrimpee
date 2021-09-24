/* global m */

import { isAuthed, clearAuth } from './services/auth.js';
import { FarmList } from './views/farms.js';
import { LoginForm } from './views/login.js';
import { TopBar } from './components/nav.js';

const App = {
  view() {
    const isLoggedIn = isAuthed();

    return m('.app-container', [
      m(TopBar, { isLoggedIn, onLogout: clearAuth }),
      m('.container-lg.pt-5',
        isLoggedIn
          ? m(FarmList)
          : m(LoginForm),
      ),
    ]);
  }
}

const rootNode = document.getElementById('app');
m.mount(rootNode, App);
