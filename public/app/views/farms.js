/* global m */

import { LabeledInput } from '../components/forms.js';
import { api } from '../services/api.js';

const FarmRow = {
  view({ attrs }) {
    const {
      farm,
      onAddPond,
      onEditFarm,
      onDeleteFarm,
    } = attrs;
    const { id, name, description } = farm;

    const addPond = () => {
      onAddPond(id);
    };

    const editFarm = () => {
      onEditFarm(id);
    };

    const deleteFarm = () => {
      onDeleteFarm(id);
    };

    return m('.row.border.rounded.mb-3.p-1', [
      m('h5', name),
      m('p.text-secondary.fst-italic', 'Size: 0'),
      m('p', description),
      m('.d-flex.justify-content-end', [
        m('button.btn.btn-primary.mx-3', { onclick: addPond }, 'Add Pond'),
        m('button.btn.btn-primary.mx-3', { onclick: editFarm }, 'Edit'),
        m('button.btn.btn-outline-danger.mx-3', { onclick: deleteFarm }, 'Delete'),
      ]),
    ]);
  },
};

const FarmForm = {
  view({ attrs, state }) {
    const { onAddFarm } = attrs;
    const { name, description } = state;

    const onclick = () => {
      onAddFarm({ name, description });
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

    const onAddFarm = async (data) => {
      try {
        const farm = await api.post('/farms', data);
        farms.push(farm);
      } catch (_) {
        // Should display error here
      }
    };

    const onAddPond = (farmId) => {

    };

    const onEditFarm = (farmId) => {

    };

    const onDeleteFarm =  async (farmId) => {
      try {
        await api.delete(`/farms/${farmId}`);
        state.farms = farms.filter(({ id }) => id !== farmId);
      } catch (_) {
        // Should display error for user
      }
    };

    return m('.container', [
      m('h3.mb-5', 'Farms'),
      farms.length > 0
        ? farms.map(farm => m(FarmRow, { farm, onAddPond, onEditFarm, onDeleteFarm }))
        : m('.text-secondary.fst-italic', 'No farms...'),
      m(FarmForm, { onAddFarm }),
    ]);
  },
};
