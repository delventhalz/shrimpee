/* global m */

const App = {
  view() {
    return m('h1.display-1', 'Hello, Shrimpee!');
  }
}

const rootNode = document.getElementById('app');
m.mount(rootNode, App);
