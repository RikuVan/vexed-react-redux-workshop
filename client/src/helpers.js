// ---------------------------------------------------------
//                        getOr
//
//  const obj = {parent: {child: {grandchild: 'hi'}}}
//  const message = getOr('parent.child.grandchild', 'moi', ob)
//  message === 'hi'
//  const defaultMessage getOr('parent.friend', 'moi', obj)
//  defaultMessage === 'moi'
// ----------------------------------------------------------

export const getOr = (pathString, alternative, obj) => {
  const paths = pathString.split('.')
  let val = obj
  let idx = 0
  while (idx < paths.length) {
    if (val == null) {
      return
    }
    val = val[paths[idx]]
    idx += 1
  }
  return val == null || val !== val ? alternative : val  // eslint-disable-line no-self-compare
}

export const pipe = (a, b) => arg => a(b(arg))
