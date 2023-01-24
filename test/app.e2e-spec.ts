import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { Authdto } from 'src/auth/dto';

describe('App e2e', () => {
  let app : INestApplication
  let prisma : PrismaService
  beforeAll(
      async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleRef.createNestApplication();
      app.useGlobalPipes( new ValidationPipe({ whitelist: true } ));

    await app.init();
    await app.listen(1317);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:1317') //without repeating this string in the url, we have set this as the base string.
  }
  )

  afterAll( () => {
    app.close();
  });

  describe('Auth', () => { 
    const dto: Authdto = {
        email: 'test@test.com',
        password: '123'
      }
    describe('Signup', () => {
      //test to verify empty password
      it('should through error if password empty', () => {
        return pactum.spec().post('/auth/signup')
        .withBody({
          email: dto.email
        })
        .expectStatus(400)
        .inspect(); 
      })
      //test to verify empty email
      it('should through error if email empty', () => {
        return pactum.spec().post('/auth/signup')
        .withBody({
          password: dto.password
        })
        .expectStatus(400)
        .inspect(); 
      })
      //test to verify empty email and pwd
      it('should through error if empty', () => {
        return pactum.spec().post('/auth/signup')
        .expectStatus(400)
        .inspect(); 
      })
      //test for successful signup
      it('should signup', () => {
        return pactum.spec().post('/auth/signup')
        .withBody(dto)
        .expectStatus(201)
        // .inspect(); //to console log the data fetched on post operation we use inspect.
      })
    });
    describe('Signin', () => { 
      //test to verify empty password
      it('should through error if password empty', () => {
        return pactum.spec().post('/auth/signin')
        .withBody({
          email: dto.email
        })
        .expectStatus(400)
        .inspect(); 
      })
      //test to verify empty email
      it('should through error if email empty', () => {
        return pactum.spec().post('/auth/signin')
        .withBody({
          password: dto.password
        })
        .expectStatus(400)
        .inspect(); 
      })
      //test to verify empty email and pwd
      it('should through error if empty', () => {
        return pactum.spec().post('/auth/signin')
        .expectStatus(400)
        .inspect(); 
      })
      it('should signin', () => {
        return pactum.spec().post('/auth/signin')
        .withBody(dto)
        .expectStatus(201)
        .stores('userAT', 'access_token') //it stores the access token in the userAT variable.
      });
    });
   });

  describe('User', () => { 
    describe('Get me', () => { 
      it('should get users details', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAT}',
        })
        .expectStatus(200)
      });
    });
    describe('Edit user', () => { });
   });

  describe('bookmark', () => { 
    describe('Create bookmark', () => { });
    describe('Get bookmarks', () => { });
    describe('Get bookmarks by id', () => { });
    describe('Edit bookmark by id', () => { });
    describe('Delete bookmark by id', () => { });
  });

  // it.todo('should pass');
});
