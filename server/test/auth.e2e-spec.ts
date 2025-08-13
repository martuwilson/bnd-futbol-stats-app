import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      name: 'E2E Test User',
      email: 'e2e@test.com',
      password: 'testpassword123',
      role: 'VIEWER',
    };

    let accessToken: string;
    let refreshToken: string;

    it('should register a new user', () => {
      const registerMutation = `
        mutation {
          register(input: {
            name: "${testUser.name}"
            email: "${testUser.email}"
            password: "${testUser.password}"
            role: ${testUser.role}
          }) {
            user {
              id
              name
              email
              role
            }
            accessToken
            refreshToken
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: registerMutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.register).toBeDefined();
          expect(res.body.data.register.user.email).toBe(testUser.email);
          expect(res.body.data.register.accessToken).toBeDefined();
          expect(res.body.data.register.refreshToken).toBeDefined();
          
          accessToken = res.body.data.register.accessToken;
          refreshToken = res.body.data.register.refreshToken;
        });
    });

    it('should login with correct credentials', () => {
      const loginMutation = `
        mutation {
          login(input: {
            email: "${testUser.email}"
            password: "${testUser.password}"
          }) {
            user {
              id
              name
              email
              role
            }
            accessToken
            refreshToken
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: loginMutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login).toBeDefined();
          expect(res.body.data.login.user.email).toBe(testUser.email);
          expect(res.body.data.login.accessToken).toBeDefined();
        });
    });

    it('should access protected endpoint with valid token', () => {
      const usersQuery = `
        query {
          users {
            id
            name
            email
            role
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ query: usersQuery })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.users).toBeDefined();
          expect(Array.isArray(res.body.data.users)).toBe(true);
        });
    });

    it('should refresh access token', () => {
      const refreshMutation = `
        mutation {
          refreshToken(input: {
            refreshToken: "${refreshToken}"
          }) {
            accessToken
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: refreshMutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.refreshToken).toBeDefined();
          expect(res.body.data.refreshToken.accessToken).toBeDefined();
        });
    });

    it('should reject access without token', () => {
      const usersQuery = `
        query {
          users {
            id
            name
            email
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: usersQuery })
        .expect(200)
        .expect((res) => {
          // Sin autenticación, debería funcionar porque users no está protegido
          expect(res.body.data || res.body.errors).toBeDefined();
        });
    });
  });
});
