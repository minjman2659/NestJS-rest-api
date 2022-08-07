# Step 1. 빌드용 node
FROM node:16 AS builder

## 프로젝트의 모든 파일을 /app 으로 복사
WORKDIR /usr/src/app
COPY . .

## 필요한 라이브러리들 설치 후 빌드 진행
RUN yarn add ts-node typescript @nestjs/cli jest @types/jest ts-jest
RUN yarn
RUN yarn build


# Step 2. 실행용 node
FROM node:16-alpine

## Step 1의 빌드용 단계에서 빌드된 프로젝트 가져오기
COPY --from=builder /usr/src/app ./

## nestjs-rest-api 실행
CMD ["yarn", "start:prod"]
EXPOSE 8080
