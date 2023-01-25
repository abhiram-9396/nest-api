import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { Authdto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
      it('should throw error if empty', () => {
        return pactum.spec().post('/auth/signin')
        .expectStatus(400)
        .inspect(); 
      })
      it('should signin', () => {
        return pactum.spec().post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
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

    //Edit User testing
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'abhiramgat@gmail.com',
          firstName: 'abhi',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
          .inspect()
      });
    });
  });

  describe('bookmark', () => { 
    describe('Get empty bookmarks', () => {
      it("should get empty bookmarks", () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expectBody([])
          // .inspect();
      })
     });

    describe('Create bookmark', () => { 
      const dto: CreateBookmarkDto ={
        title: 'First bookmark',
        link: 'https://docs.nestjs.com/',
      }
      it("should create bookmarks", () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId','id')
          // .inspect();
      })
    });
    describe('Get bookmarks', () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          // .inspect()
          .expectJsonLength(1); //atleast one element should be present in the array.
      })
     });
    describe('Get bookmarks by id', () => {
      it("should get bookmark by id", () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id','$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          // .inspect()
          .expectBodyContains('$S{bookmarkId}')
      })
     });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'first edited bookmark',
        description: 'this description is added from edit'
      }
      it("should edit bookmark by id", () => {
        return pactum
          .spec() 
          .patch('/bookmarks/{id}')
          .withPathParams('id','$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          // .inspect()
      })
     });

    describe('Delete bookmark by id', () => {
      it("should delete bookmark by id", () => {
        return pactum
          .spec() 
          .delete('/bookmarks/{id}')
          .withPathParams('id','$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(204);
          // .inspect()
      });
     });

  });
});
