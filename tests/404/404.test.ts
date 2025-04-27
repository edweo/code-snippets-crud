import request, { type Response } from 'supertest'
import { app } from '../../src/server.js'

describe('404 tests', () => {
  describe('GET tests for /949421', () => {
    it('should return NOT FOUND 404 for GET /949421', async () => {
      const res: Response = await request(app).get('/949421')
      expect(res.statusCode).toBe(404)
    })

    it('should return Content-Type text/html', async () => {
      const res: Response = await request(app).get('/949421')
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8')
    })
  })

  describe('POST tests for /949421', () => {
    it('should return NOT FOUND 404 for POST /949421', async () => {
      const res: Response = await request(app).post('/949421').send({ name: 'hello' })
      expect(res.statusCode).toBe(404)
    })

    it('should return Content-Type text/html', async () => {
      const res: Response = await request(app).post('/949421').send({ name: 'hello' })
      expect(res.headers['content-type']).toBe('text/html; charset=utf-8')
    })
  })
})
