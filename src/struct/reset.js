const reset = {
  props: {
    reset: (t, val, key, stamp, isNew, original) => {
      console.log('w00000t ????')
      if (!original.type) {
        t.forEach(val === true
          ? p => p.set(null, stamp)
          : (p, key) => val.indexOf(key) === -1 && p.set(null, stamp)
        )
      }
    }
  }
}

export default reset
