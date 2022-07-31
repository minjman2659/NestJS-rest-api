# NestJS-rest-api

NestJS를 활용한 REST API <br />

### [What is NestJS?](https://docs.nestjs.com/)

```plain
 1. NodeJS에 기반을 둔 웹 API 프레임워크로서 Express 및 Fastify와 같은 NodeJS 프레임워크를 래핑하여 동작한다.
 2. 그 동안의 NodeJS 웹 프레임워크가 가지지 못한 구조적인 아키텍쳐를 제공함으로서 개발자로 하여금 구조화된 코딩이 가능하도록 도와준다.
 3. TypeScript 및 OOP(객체지향프로그래밍), 모듈화 등을 지원해준다.
 4. 백엔드 서버가 갖추어야 하는 많은 필수 기능을 프레임워크 내에 내장하고 있고, 추가로 필요한 기능을 설치하고 적용하는 방법을 문서로 제공해주는 개발자 친화적인 프레임워크이다.
```

### NestJS Life Cycle
![image](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c024a314-3837-4e99-b439-c554cb8128d4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220731%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220731T140221Z&X-Amz-Expires=86400&X-Amz-Signature=a94cc4bd80e904bc50065f8b85ac087437e515a67126d9ba7c1d3693494991ac&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

<br />

## 💻 기술 스택

NestJS, Fastify, Typescript, TypeORM, PostgreSQL, JWT, Jest, Swagger

<br />

## 🔖 환경 설정

.env.example을 참고하여 실행할 환경에 따라 .env.dev 또는 .env.prod로 env 파일을 만들어 실행한다.

```javascript
# server
PORT=something // 서버 실행 포트 넘버
API_HOST=something // API 실행 URL
CLIENT_HOST=something // 클라이언트 실행 URL

# auth
SECRET_KEY=something // JWT를 이용하여 토큰을 생성할때 사용할 Key값

# environment
NODE_ENV=something // 실행 환경: development or production

# database
POSTGRES_DATABASE=something // 데이터베이스 이름
POSTGRES_PORT=something // 데이터베이스 포트 넘버
POSTGRES_HOST=something // 데이터베이스 주소
POSTGRES_USER=something // 데이터베이스 관리자 이름
POSTGRES_PW=somethings // 데이터베이스 관리자 비밀번호
```

<br />

## 📌 실행 방법(package.json 참고)

Node 16 혹은 그 이상의 버전을 필요로 한다.

```javascript
 $ yarn // install dependencies
 $ yarn start // production 환경에서 서버 실행
 $ yarn start:dev // development 환경에서 서버 실행
```

### Build

타입스크립트 컴파일링

```javascript
 $ yarn build // compile ts files
```

### Test

```javascript
 $ yarn test 또는 $ yarn test:watch // run jest
 $ yarn test:cov // 테스트 커버리지
```

<br />

## 📋 API 명세서

yarn 으로 필요한 패키지 설치 진행 후 Nest 서버 실행한 뒤에 <br />
http://localhost:8080/api/docs 주소 입력

![image](https://user-images.githubusercontent.com/81504356/182029268-0d0bc5e4-705d-4ae2-ad4a-db8bda937e4d.png)

<br />

## 🔐 인증 및 인가

### 인증

- JWT를 이용한 토큰 인증 방식을 활용하였다.
- 회원가입 및 로그인을 진행할 경우, 유저 정보를 기반으로 accessToken과 refreshToken을 만들어 accessToken은 body로, refreshToken은 cookies로 전달한다. 

### 인가

- 이후 Request의 headers_Baerer Authorization 안에는 accessToken이, cookies 안에는 refreshToken이 담겨서 서버로 전달된다.
- Request가 올때마다 Fastify의 'preHandler' 훅으로 토큰에 저장된 유저정보를 색출하여 request.user 객체를 생성하고, 이를 바탕으로 Guard에서 검증을 진행한다.
- 만약 accessToken이 만료되었지만 refreshToken이 존재할 경우, Interceptor에서 accessToken을 재발급하여 body로 전달한다. 
