import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { jwtToken } from './auth.e2e-spec';

describe('BlogController (e2e)', () => {
  let app: INestApplication;
  let blogId: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/blog (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/blog')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'My Blog Title',
        content: 'My blog content',
      })
      .expect(201);

    blogId = res.body.id;
    expect(res.body.title).toBe('My Blog Title');
  });

  it('/blog/my (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/blog/my')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/blog/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/blog/${blogId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.id).toBe(blogId);
  });

  it('/blog/:id (PUT)', async () => {
    const res = await request(app.getHttpServer())
      .put(`/blog/${blogId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Updated Title',
        content: 'Updated Content',
      })
      .expect(200);

    expect(res.body.message).toBe('User updated successfully');
  });

  afterAll(async () => {
    await app.close();
  });
});
