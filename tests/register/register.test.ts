import request, { type Response } from 'supertest'
import { app } from '../../src/server.js'
import { expect } from 'vitest'
import config from '../../server_config.js'

describe('Register page tests', () => {
  describe('GET tests for /register', () => {
    it('should return OK 200 to retrieve register HTML page', async () => {
      const res: Response = await request(app).get(config.base_url + '/register')
      expect(res.statusCode).toBe(200)
    })

    it('should return Content-Type text/html', async () => {
      const res: Response = await request(app).get(config.base_url + '/register')
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8')
    })
  })

  describe('POST tests when registering users for /register', () => {
    it.each([
      ['dave', '123'],
      ['Ave', '123'],
      ['Ben7a', '123'],
      ['davee', '123'],
      ['davee1', '123'],
      ['davee2', '123'],
      ['davee3', '123']
    ])('should register new user: %s %s %s', async (a, b) => {
      const formData = new URLSearchParams()
      formData.append('username', a)
      formData.append('password', b)
      const res: Response = await request(app).post(config.base_url + '/register').send(formData.toString())
      expect(res.statusCode).toBe(302)
      expect(res.headers.location).toBe(config.base_url + '/snippets')
    })

    it.each([
      ['dave', '123', 302],
      ['Ave', '123', 302],
      ['Ben7a', '123', 302],
      ['davee', '123', 302],
      ['davee1', '123', 302],
      ['davee2', '123', 302],
      ['davee3', '123', 302]
    ])('should not register existing user: %s %s %s', async (a, b, c) => {
      const formData = new URLSearchParams()
      formData.append('username', a)
      formData.append('password', b)
      const res: Response = await request(app).post(config.base_url + '/register').send(formData.toString())
      expect(res.statusCode).toBe(c)
    })

    it.each([
      ['da', '123', 302],
      ['Av', '12', 302],
      ['Be', '123', 302],
      ['davee', '13', 302],
      ['davee1', '13', 302],
      ['dave2', '13', 302],
      ['dav', '1', 302],
      ['', '', 302],
      ['1', '1', 302],
      ['', '1', 302],
      ['1', '0', 302],
      ['dav', '12', 302]
    ])('should not register user with name or password too short: %s %s %s', async (a, b, c) => {
      const formData = new URLSearchParams()
      formData.append('username', a)
      formData.append('password', b)
      const res: Response = await request(app).post(config.base_url + '/register').send(formData.toString())
      expect(res.statusCode).toBe(c)
    })
  })
})
