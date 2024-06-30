import vine, { VineLiteral } from '@vinejs/vine'
import type { SchemaTypes } from '@vinejs/vine/types'

type FieldValidation = Record<string, SchemaTypes>
type ValidationObject = Record<string, FieldValidation>

type ConstrainedObject<T extends FieldValidation> = {
  [Key in keyof T]: T[Key]
}

type ConstrainedValidation<T extends ValidationObject> = {
  [Key in keyof T]: ConstrainedObject<T[Key]>
}

export function intentValidation<T extends ValidationObject>(
  validations2: ConstrainedValidation<T>
) {
  type ValidationWithIntent = {
    [Key in keyof T]: ConstrainedObject<T[Key]> & { intent: VineLiteral<Key> }
  }
  const validations = validations2 as ValidationWithIntent
  Object.keys(validations).forEach((key) => {
    validations[key].intent = vine.literal(key)
  })

  const validationGroup = vine.group(
    (
      Object.entries(validations) as [
        keyof ValidationWithIntent,
        ValidationWithIntent[keyof ValidationWithIntent],
      ][]
    ).map(([key, entry]) => vine.group.if((data) => data.intent === key, entry))
  )

  return vine.compile(
    vine
      .object({
        intent: vine.enum(Object.keys(validations)),
      })
      .merge(validationGroup)
  )
}
