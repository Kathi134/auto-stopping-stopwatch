const multiRemoveStyle = {
  multiValueRemove: (styles) => ({
    ...styles,
    ':hover': {
      backgroundColor: 'var(--background)',
      color: 'var(--default-color)',
    },
  }),
};

// const selectTheme = (theme) => ({
//     ...theme,
//     colors: {
//       ...theme.colors,
//       primary: 'var(--default-color)',
//       primary75: 'var(--default-color)',
//       primary50: 'var(--default-color)',
//       primary25: 'var(--default-color)',
//       neutral40: 'var(--default-color)',
//       neutral20: 'var(--default-color)',
//       danger: 'var(--default-color)',
//       dangerLight: 'var(--default-color)',
//     },
//   })

export {multiRemoveStyle};