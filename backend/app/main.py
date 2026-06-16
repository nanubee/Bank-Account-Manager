from fastapi import FastAPI

from app.routes.accounts import router as accounts_router
from app.routes.transactions import router as transactions_router
#from app.routes.fixed_deposits import router as fd_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts_router)
app.include_router(transactions_router)
#app.include_router(fd_router)