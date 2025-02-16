import { NormalizeConstructor } from "@adonisjs/core/types/helpers";
import { BaseModel, beforeCreate, column } from "@adonisjs/lucid/orm";
import { nanoid } from "nanoid";
import { randomUUID } from 'node:crypto';

export function withUuid() {
  return <Model extends NormalizeConstructor<typeof BaseModel>>(source: Model) => {
    class UuidModel extends source {
      static selfAssignPrimaryKey = true

      @column({ isPrimary: true })
      declare id: string

      @beforeCreate()
      static async generateId<T extends typeof UuidModel>(
        this: T,
        modelInstance: InstanceType<T>
      ) {
        if (!modelInstance.id) {
          modelInstance.id = randomUUID()
        }
      }
    }

    return UuidModel
  }
}

export function withNanoId() {
  return <Model extends NormalizeConstructor<typeof BaseModel>>(source: Model) => {
    class NanoIdModel extends source {
      static selfAssignPrimaryKey = true

      @column({ isPrimary: true })
      declare id: string

      @beforeCreate()
      static async generateId<T extends typeof NanoIdModel>(
        this: T,
        modelInstance: InstanceType<T>
      ) {
        if (!modelInstance.id) {
          modelInstance.id = nanoid()
        }
      }
    }

    return NanoIdModel
  }
}
