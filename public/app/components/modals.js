/* global m */

import { LabeledInput } from '../components/forms.js';

let submitFn = () => {};

// Bootstrap  must be mounted at the root level and hidden, outside the
// component tree. This button will do the work of showing the appropriate
// modal and returning its state to the passed onSubmit callback.
export const ModalButton = {
  view({ attrs, children }) {
    const { modalId, onSubmit, ...buttonAttrs } = attrs;

    // const onclick = () => {
    //   submitFn = (modalState) => {
    //     onSubmit(modalState);
    //     submitFn = () => {};
    //   }
    // };

    return m('button.btn', {
      type: 'button',
      'data-bs-toggle': 'modal',
      'data-bs-target': `#${modalId}`,
      ...buttonAttrs,
    }, children);
  },
};

export const Modal = {
  view({ attrs, children }) {
    const { id, title, onSubmit } = attrs;

    const labelId = `${id}-label`;

    return m(
      '.modal.fade',
      {
        id,
        tabindex: -1,
        'aria-labelledby': labelId,
        'aria-hidden': true,
      },
      m('.modal-dialog',
        m('.modal-content',

          m('.modal-header',
            m('h5.modal-title', { id: labelId }, title),
            m('button.btn-close', {
              type: 'button',
              'data-bs-dismiss': 'modal',
              'aria-label': 'Close',
            }),
          ),

          m('.modal-body', children),

          m('.modal-footer',
            m('button.btn.btn-secondary', {
              type: 'button',
              'data-bs-dismiss': 'modal',
            }, 'Cancel'),
            m('button.btn.btn-primary', {
              type: 'button',
              'data-bs-dismiss': 'modal',
              onclick: onSubmit,
            }, 'Submit'),
          ),
        ),
      ),
    );
  },
};
