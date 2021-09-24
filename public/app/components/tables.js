/* global m */

export const Table = {
  view({ attrs }) {
    const { data, ...tableAttrs } = attrs;
    const [headers, ...rows] = data;

    return m('table.table.table-striped', tableAttrs, [
      m('thead',
        headers.map(header => m('th[scope=col]', header)),
      ),
      m('tbody',
        rows.map(row => m('tr', row.map(col => m('td', col)))),
      ),
    ]);
  },
};
