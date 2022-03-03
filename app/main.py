import uvicorn

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware

from app.middlewares.custom_middleware import access_control
from app.middlewares.trusted_hosts import TrustedHostMiddleware

from app.routers import index
from app.common.config import conf


def create_app():
    """
    앱 함수 실행
    :return:
    """

    app = FastAPI()
    app.mount("/static", StaticFiles(directory="static"), name="static")


    # 미들웨어 정의
    app.add_middleware(middleware_class=BaseHTTPMiddleware, dispatch=access_control)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=conf().ALLOW_SITE,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=conf().TRUSTED_HOSTS, except_path=["/health"])

    # 라우터 정의
    app.include_router(index.router)
    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)