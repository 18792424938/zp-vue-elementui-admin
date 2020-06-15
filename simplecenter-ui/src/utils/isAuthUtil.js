export function isAuth (val) {
  const permsStr = sessionStorage.getItem('perms')
  if (permsStr) {
    const perms = JSON.parse(permsStr)
    const vals = val.split(',')
    for (let i = 0; i < vals.length; i++) {
      if (!perms.includes(vals[i])) {
        return false
      }
    }
    return true
  }
  return false
}
