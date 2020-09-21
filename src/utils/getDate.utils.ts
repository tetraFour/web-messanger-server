export const date = () =>
  `${new Date().getMonth() +
    1}(month), ${new Date().getDate()}(day), ${new Date().getHours()}:${new Date().getMinutes()}.`;
