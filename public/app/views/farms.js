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

const getUpdater = (onUpdate, baseResource = {}) => async (update) => {
  await onUpdate({ ...baseResource, ...update });
};

const FarmRow = {
  view({ attrs }) {
    const { farm, onUpdate } = attrs;
    const {
      id,
      name,
      description,
      size,
      ponds,
    } = farm;

    const addPond = async (data) => {
      await onUpdate(() => api.post(`/farms/${id}/ponds`, data));
    };

    const editFarm = async (update) => {
      await onUpdate(() => api.put(`/farms/${id}`, update));
    };

    const deleteFarm = async () => {
      await onUpdate(() => api.delete(`/farms/${id}`));
    };

    const getPondDeleter = (pondId) => async () => {
      await onUpdate(() => api.delete(`/farms/${id}/ponds/${pondId}`));
    };

    const setFarmModalUpdater = () => {
      updateFarm = getUpdater(editFarm, farm);
    };

    const setPondModalUpdater = () => {
      updatePond = getUpdater(addPond);
    };

    return m('.row.border.rounded.mb-3.p-3', [
      m('h5', name),
      m('p.text-secondary.fst-italic', `Size: ${size} hectares`),
      m('p', description),

      m('.container',
        ponds.length > 0
          ? (
            m(Table, {
              data: [
                ['Pond', 'Description', 'Size', ''],
                ...ponds.map(pond => [
                  pond.name,
                  pond.description,
                  pond.size,
                  m('button.btn.btn-sm.btn-danger',
                    { onclick: getPondDeleter(pond.id) },
                    'Remove'
                  ),
                ]),
              ],
            })
          )
          : m('.text-secondary.fst-italic', 'No ponds...'),
      ),

      m('.d-flex.justify-content-end', [
        m(ModalButton, {
          class: 'btn-primary ms-3',
          modalId: ADD_POND_ID,
          onclick: setPondModalUpdater,
        }, 'Add Pond'),
        m(ModalButton, {
          class: 'btn-primary ms-3',
          modalId: UPDATE_FARM_ID,
          onclick: setFarmModalUpdater,
        }, 'Edit'),
        m('button.btn.btn-outline-danger.ms-3', { onclick: deleteFarm }, 'Delete'),
      ]),
    ]);
  },
};

const FarmForm = {
  view({ attrs, state }) {
    const { onUpdate } = attrs;
    const { name, description } = state;

    const onclick = async () => {
      await onUpdate(() => api.post('/farms', { name, description }));
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

const getFarmsRefresher = (state) => async (update = () => {}) => {
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
    getFarmsRefresher(state)();
  },

  view({ state }) {
    const onUpdate = getFarmsRefresher(state);
    const { farms } = state;

    return m('.container', [
      m('h3.mb-5', 'Farms'),
      farms.length > 0
        ? farms.map(farm => m(FarmRow, { farm, onUpdate }))
        : m('.text-secondary.fst-italic', 'No farms...'),
      m(FarmForm, { onUpdate }),
      m(UpdateFarmModal),
      m(PondModal, { id: ADD_POND_ID, title: 'Add Pond' }),
    ]);
  },
};
