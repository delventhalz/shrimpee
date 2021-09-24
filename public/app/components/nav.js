/* global m */

const HOME_PAGE = 'https://shrimpee.netlify.app/';

export const TopBar = {
  view({ attrs }) {
    const { isLoggedIn, onLogout } = attrs;

    return m('nav.navbar.fixed-top.navbar-dark.bg-dark', [
      m('.container-fluid',
        m('a.navbar-brand', { href: HOME_PAGE }, 'Shrimpee'),
        isLoggedIn && (
          m('button.btn.btn-outline-light', { onclick: onLogout }, 'Logout')
        )
      ),
    ]);
  },
};
