import request, { type Response } from 'supertest'
import { app } from '../../src/server.js'
import { beforeAll } from 'vitest'
import config from '../../server_config.js'

describe('Login page tests', () => {
  describe('GET tests for /login', () => {
    it('should return OK 200 to retrieve login HTML page', async () => {
      const res: Response = await request(app).get(config.base_url + '/login')
      expect(res.statusCode).toBe(200)
    })

    it('should return Content-Type text/html', async () => {
      const res: Response = await request(app).get(config.base_url + '/login')
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8')
    })
  })

  describe('POST tests for logging in for /login', () => {
    // Register some dummy accounts
    beforeAll(async (): Promise<void> => {
      const someUsers = [
        ['dave', '123'],
        ['Ave', '123'],
        ['Ben7a', '123'],
        ['davee', '123'],
        ['davee1', '123'],
        ['davee2', '123'],
        ['davee3', '123']]

      const registerUser = async (user: string[]): Promise<Response> => {
        const formData = new URLSearchParams()
        formData.append('username', user[0])
        formData.append('password', user[1])
        return await request(app).post(config.base_url + '/register').send(formData.toString())
      }

      const promises: Array<Promise<Response>> = []
      someUsers.forEach((user: string[]) => {
        promises.push(registerUser(user))
      })

      await Promise.all(promises)
    })

    it.each([
      ['dave', '123'],
      ['Ave', '123'],
      ['Ben7a', '123'],
      ['davee', '123'],
      ['davee1', '123'],
      ['davee2', '123'],
      ['davee3', '123']
    ])('should login: %s %s', async (a, b) => {
      const formData = new URLSearchParams()
      formData.append('username', a)
      formData.append('password', b)
      const res: Response = await request(app).post(config.base_url + '/login').send(formData.toString())
      expect(res.statusCode).toBe(302)
    })

    it.each([
      ['dave', '1234'],
      ['Ave', '1234'],
      ['Ben7a', '1234'],
      ['davee', '1234'],
      ['davee1', '1234'],
      ['davee2', '1234'],
      ['davee3', '1234']
    ])('should fail login wrong password: %s %s', async (a, b) => {
      const formData = new URLSearchParams()
      formData.append('username', a)
      formData.append('password', b)
      const res: Response = await request(app).post(config.base_url + '/login').send(formData.toString())
      expect(res.statusCode).toBe(302)
    })

    it.each([
      ['daveaa', '1234'],
      ['Aveaa', '1234'],
      ['Ben7aaa', '1234'],
      ['daveeaa', '1234'],
      ['davee1aa', '1234'],
      ['davee2aa', '1234'],
      ['davee3aa', '1234']
    ])('should fail login unknown username: %s %s', async (a, b) => {
      const formData = new URLSearchParams()
      formData.append('username', a)
      formData.append('password', b)
      const res: Response = await request(app).post(config.base_url + '/login').send(formData.toString())
      expect(res.statusCode).toBe(302)
    })
  })
})
