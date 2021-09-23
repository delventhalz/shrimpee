export const LabeledInput = {
  view({ attrs }) {
    const {
      id,
      label,
      type = 'text',
      value,
      onValue,
      ...containerAttrs
    } = attrs;

    const inputId = `${id}-input`;

    return m(`#${id}.mb-3`, containerAttrs, [
      m(`label.form-label[for=${inputId}]`, label),
      m('input.form-control', {
        id: inputId,
        type,
        value,
        oninput: e => onValue(e.target.value),
      }),
    ]);
  }
};
