/* global m */

import { LabeledInput } from '../components/forms.js';
import { Modal, ModalButton } from '../components/modals.js';
import { Table } from '../components/tables.js';
import { api } from '../services/api.js';

const UPDATE_FARM_ID = 'update-farm-modal';
const ADD_POND_ID = 'add-pond-modal';

// Resources share the same modals, and therefore the same global updaters
let updateFarm = () => {};
let updatePond = () => {};

const getUpdater = (resource, onUpdate) => async (update) => {
  await onUpdate({ ...resource, ...update });
};

const FarmRow = {
  view({ attrs }) {
    const {
      farm,
      onAddPond,
      onUpdateFarm,
      onDeleteFarm,
    } = attrs;
    const {
      id,
      name,
      description,
      size,
      ponds,
    } = farm;

    const setFarmModalUpdater = () => {
      updateFarm = getUpdater(farm, onUpdateFarm);
    };

    const setPondModalUpdater = () => {
      updatePond = getUpdater({ farm: id }, onAddPond);
    };

    const deleteFarm = () => {
      onDeleteFarm(id);
    };

    return m('.row.border.rounded.mb-3.p-1', [
      m('h5', name),
      m('p.text-secondary.fst-italic', `Size: ${size} hectares`),
      m('p', description),

      m(Table, {
        class: 'my-3',
        data: [
          ['Pond', 'Description', 'Size'],
          ...ponds.map(pond => [pond.name, pond.description, pond.size]),
        ],
      }),

      m('.d-flex.justify-content-end', [
        m(ModalButton, {
          class: 'btn-primary mx-3',
          modalId: ADD_POND_ID,
          onclick: setPondModalUpdater,
        }, 'Add Pond'),
        m(ModalButton, {
          class: 'btn-primary mx-3',
          modalId: UPDATE_FARM_ID,
          onclick: setFarmModalUpdater,
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
      const updatePromise = updateFarm(state.farm);

      // Prevent double clicks from sending two updates
      updateFarm = () => {};
      await updatePromise;

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

const PondModal = {
  oninit({ state }) {
    state.pond = {};
  },

  view({ attrs, state }) {
    const { id, title } = attrs;

    const onSubmit = async () => {
      const updatePromise = updatePond({
        ...state.pond,
        size: Number(state.pond.size)
      });

      // Prevent double clicks from sending two updates
      updatePond = () => {};
      await updatePromise;

      state.pond = {};
    };

    return m(Modal, { id, title, onSubmit }, [
      m(LabeledInput, {
        id: `${id}-name`,
        label: 'Name',
        value: state.pond.name,
        onValue: val => { state.pond.name = val; },
      }),
      m(LabeledInput, {
        id: `${id}-description`,
        label: 'Description',
        value: state.pond.description,
        onValue: val => { state.pond.description = val; },
      }),
      m(LabeledInput, {
        id: `${id}-size`,
        label: 'Size (hectares)',
        value: state.pond.size,
        onValue: val => { state.pond.size = val; },
      }),
    ]);
  },
};

const getFarmsUpdateSender = (state) => async (update) => {
  try {
    await update();
    state.farms = await api.get('/farms');
  } catch (_) {
    // Should display error for user
  }
};

export const FarmList = {
  async oninit({ state }) {
    state.farms = [];
    getFarmsUpdateSender(state)(() => {});
  },

  view({ state }) {
    const sendFarmsUpdate = getFarmsUpdateSender(state);
    const { farms } = state;

    const onAddFarm = async (data) => {
      await sendFarmsUpdate(() => api.post('/farms', data));
    };

    const onAddPond = async ({ farm, ...data }) => {
      await sendFarmsUpdate(() => api.post(`/farms/${farm}/ponds`, data));
    };

    const onUpdateFarm = async (update) => {
      await sendFarmsUpdate(() => api.put(`/farms/${update.id}`, update));
    };

    const onDeleteFarm = async (farmId) => {
      await sendFarmsUpdate(() => api.delete(`/farms/${farmId}`));
    };

    return m('.container', [
      m('h3.mb-5', 'Farms'),
      farms.length > 0
        ? farms.map(farm => m(FarmRow, { farm, onAddPond, onUpdateFarm, onDeleteFarm }))
        : m('.text-secondary.fst-italic', 'No farms...'),
      m(FarmForm, { onAddFarm }),
      m(UpdateFarmModal),
      m(PondModal, { id: ADD_POND_ID, title: 'Add Pond' }),
    ]);
  },
};
