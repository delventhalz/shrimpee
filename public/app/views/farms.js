/* global m */

import { LabeledInput } from '../components/forms.js';
import { Modal, ModalButton } from '../components/modals.js';
import { api } from '../services/api.js';

const UPDATE_FARM_ID = 'update-farm-modal';

// Farms share the same update modal, and therefore the same global updater
let updateFarm = () => {};

const getFarmUpdater = (farm, onUpdate) => async (update) => {
  await onUpdate({ ...farm, ...update });
};

const FarmRow = {
  view({ attrs }) {
    const { farm, onUpdateFarm, onDeleteFarm } = attrs;
    const { id, name, description } = farm;

    const setModalUpdater = () => {
      updateFarm = getFarmUpdater(farm, onUpdateFarm);
    };

    const deleteFarm = () => {
      onDeleteFarm(id);
    };

    return m('.row.border.rounded.mb-3.p-1', [
      m('h5', name),
      m('p.text-secondary.fst-italic', 'Size: 0'),
      m('p', description),
      m('.d-flex.justify-content-end', [
        m('button.btn.btn-primary.mx-3', { onclick: () => {} }, 'Add Pond'),
        m(ModalButton, {
          class: 'btn-primary mx-3',
          modalId: UPDATE_FARM_ID,
          onclick: setModalUpdater,
        }, 'Edit'),
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

const UpdateFarmModal = {
  oninit({ state }) {
    state.farm = {};
  },

  view({ state }) {
    const onSubmit = async () => {
      await updateFarm(state.farm);
      updateFarm = () => {};
      state.farm = {};
    };

    return m(Modal, { id: UPDATE_FARM_ID, title: 'Update Farm', onSubmit }, [
      m(LabeledInput, {
        id: 'update-farm-name',
        label: 'Name',
        value: state.farm.name,
        onValue: val => { state.farm.name = val; },
      }),
      m(LabeledInput, {
        id: 'update-farm-description',
        label: 'Description',
        value: state.farm.description,
        onValue: val => { state.farm.description = val; },
      }),
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

    const onUpdateFarm = async (update) => {
      try {
        await api.put(`/farms/${update.id}`, update);
        state.farms = farms.map(farm => farm.id === update.id ? update : farm);
      } catch (_) {
        // Should display error for user
      }
    };

    const onDeleteFarm = async (farmId) => {
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
        ? farms.map(farm => m(FarmRow, { farm, onUpdateFarm, onDeleteFarm }))
        : m('.text-secondary.fst-italic', 'No farms...'),
      m(FarmForm, { onAddFarm }),
      m(UpdateFarmModal),
    ]);
  },
};
