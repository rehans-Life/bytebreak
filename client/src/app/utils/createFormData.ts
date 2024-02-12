import { Option } from '../components/select'

interface Object {
  [key: string]: any
}

function isOption(obj: object): obj is Option<any> {
  return (
    (obj as Option<any>).label !== undefined &&
    (obj as Option<any>).value !== undefined
  )
}

export default function (obj: Object) {
  const formData = new FormData()

  function appendField(field: string, value: any) {
    if (isOption(value)) {
      formData.append(field, value.value.toString())
      return true
    }

    if (typeof value === 'string' || typeof value === 'number') {
      formData.append(field, value.toString())
      return true
    }

    if(value instanceof Blob) {
      formData.append(field, value)
      return true      
    }

    return false
  }

  function helper(parent: string | null, arg: Object) {
    for (const field in arg) {
      const fieldOrginal = parent ? `${parent}[${field}]` : field
      const value = arg[field]

      if (value instanceof Array) {
        value.forEach((el: any, index) => {
          const arrayField = `${fieldOrginal}[${index}]`
          if (!appendField(arrayField, el)) {
            helper(arrayField, el)
          }
        })
        continue
      }

      if (!appendField(fieldOrginal, value)) {
        helper(fieldOrginal, arg[field])
      }
    }
  }

  helper(null, obj)

  return formData
}
