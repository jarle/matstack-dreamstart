import { test } from '@japa/runner'
import vine from '@vinejs/vine'
import { intentValidation } from '../../resources/react_app/utils/intent_validation.js'

test.group('Intent validation', () => {
  test('validates basic intent with string field', async ({ assert }) => {
    const validation = intentValidation({
      login: {
        email: vine.string().email(),
        password: vine.string().minLength(6),
      },
    })

    const validData = {
      intent: 'login',
      email: 'test@example.com',
      password: 'password123',
    }

    const result = await validation.validate(validData)
    assert.deepEqual(result, validData)
  })

  test('validates multiple intents', async ({ assert }) => {
    const validation = intentValidation({
      login: {
        email: vine.string().email(),
        password: vine.string().minLength(6),
      },
      register: {
        email: vine.string().email(),
        password: vine.string().minLength(6),
        confirmPassword: vine.string(),
      },
    })

    const loginData = {
      intent: 'login',
      email: 'test@example.com',
      password: 'password123',
    }

    const registerData = {
      intent: 'register',
      email: 'new@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    }

    const loginResult = await validation.validate(loginData)
    const registerResult = await validation.validate(registerData)

    assert.deepEqual(loginResult, loginData)
    assert.deepEqual(registerResult, registerData)
  })

  test('validates intent with different field types', async ({ assert }) => {
    const validation = intentValidation({
      updateProfile: {
        name: vine.string().minLength(2),
        age: vine.number().min(18),
        isActive: vine.boolean(),
      },
    })

    const validData = {
      intent: 'updateProfile',
      name: 'John Doe',
      age: 25,
      isActive: true,
    }

    const result = await validation.validate(validData)
    assert.deepEqual(result, validData)
  })

  test('throws error for invalid intent', async ({ assert }) => {
    const validation = intentValidation({
      login: {
        email: vine.string().email(),
      },
    })

    const invalidData = {
      intent: 'invalid',
      email: 'test@example.com',
    }

    await assert.rejects(() => validation.validate(invalidData))
  })

  test('throws error for missing required fields', async ({ assert }) => {
    const validation = intentValidation({
      login: {
        email: vine.string().email(),
        password: vine.string().minLength(6),
      },
    })

    const invalidData = {
      intent: 'login',
      email: 'test@example.com',
    }

    await assert.rejects(() => validation.validate(invalidData))
  })

  test('throws error for invalid field values', async ({ assert }) => {
    const validation = intentValidation({
      login: {
        email: vine.string().email(),
        password: vine.string().minLength(6),
      },
    })

    const invalidData = {
      intent: 'login',
      email: 'invalid-email',
      password: '123',
    }

    await assert.rejects(() => validation.validate(invalidData))
  })

  test('validates intent with optional fields', async ({ assert }) => {
    const validation = intentValidation({
      updateProfile: {
        name: vine.string().minLength(2),
        bio: vine.string().optional(),
      },
    })

    const dataWithOptional = {
      intent: 'updateProfile',
      name: 'John Doe',
      bio: 'Software developer',
    }

    const dataWithoutOptional = {
      intent: 'updateProfile',
      name: 'John Doe',
    }

    const result1 = await validation.validate(dataWithOptional)
    const result2 = await validation.validate(dataWithoutOptional)

    assert.deepEqual(result1, dataWithOptional)
    assert.deepEqual(result2, dataWithoutOptional)
  })

  test('validates intent with empty validation object', async ({ assert }) => {
    const validation = intentValidation({
      simple: {},
    })

    const validData = {
      intent: 'simple',
    }

    const result = await validation.validate(validData)
    assert.deepEqual(result, validData)
  })
})
