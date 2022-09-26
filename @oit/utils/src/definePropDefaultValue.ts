function definePropDefaultValue(components: any, props: object) {
  Object.entries(props)
    .forEach(([key, value]) => {
      // if (isPlainObject(components.props[key])) {
      //   components.props[key].default = value
      // } else {
      //   components.props[key] = {
      //     type: components.props[key],
      //     default: value,
      //   }
      // }
    })
}

export default definePropDefaultValue
