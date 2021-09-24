/* global m */

import { LabeledInput } from '../components/forms.js';
import { api } from '../services/api.js';

const FarmRow = {
  view({ attrs }) {
    const { name, description } = attrs;

    return m('.row.border.rounded.mb-3.p-1', [
      m('h5', name),
      m('p.text-secondary.fst-italic', 'Size: 0'),
      m('p', description),
    ]);
  },
};

const FarmForm = {
  view({ attrs, state }) {
    const { onAdd } = attrs;
    const { name, description } = state;

    const onclick = () => {
      onAdd({ name, description });
      state.name = '';
      state.description = '';
      m.redraw();
    };

    return m('.row.border.rounded.bg-light.p-3.mt-5', [
      m('h5', 'Add Farm'),
      m(LabeledInput, {
        id: 'farm-name',
        label: 'Name',
        value: name,
        onValue: val => { state.name = val; },
      }),
      m(LabeledInput, {
        id: 'farm-description',
        label: 'Description',
        value: description,
        onValue: val => { state.description = val; },
      }),
      m('button.btn.btn-primary', { onclick }, 'Create'),
    ]);
  },
};

export const FarmList = {
  async oninit({ state }) {
    state.farms = [];
    const farms = await api.get('/farms');
    state.farms = farms;
  },

  view({ state }) {
    const { farms } = state;

    const onAdd = async (data) => {
      try {
        const farm = await api.post('/farms', data);
        farms.push(farm);
      } catch (_) {
        // Should display error here
      }
    };

    return m('.container', [
      m('h3.mb-5', 'Farms'),
      farms.length > 0
        ? farms.map(attrs => m(FarmRow, attrs))
        : m('.text-secondary.fst-italic', 'No farms...'),
      m(FarmForm, { onAdd }),
    ]);
  },
};
