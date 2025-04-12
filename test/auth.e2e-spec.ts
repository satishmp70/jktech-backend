import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export let jwtToken: string;

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - login user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'secureadminpass',
      });
      
    expect(res.statusCode).toBe(201);
    expect(res.body.accessToken).toBeDefined();

    jwtToken = res.body.accessToken; 
  });

  afterAll(async () => {
    await app.close();
  });
});
