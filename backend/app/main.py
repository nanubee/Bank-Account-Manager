from fastapi import FastAPI

from app.routes.accounts import router as accounts_router
from app.routes.transactions import router as transactions_router
from app.routes.fixed_deposits import router as fd_router
from app.routes.recurring_deposits import router as rd_router
from app.routes.dashboard import router as dashboard_router
from app.routes.mutual_fund import router as mf_router
from app.routes.stock import router as stock_router
from app.routes.asset import router as asset_router
from app.routes.auth import router as auth_router


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
app.include_router(fd_router)
app.include_router(rd_router)
app.include_router(dashboard_router)
app.include_router(mf_router)
app.include_router(stock_router)
app.include_router(asset_router)
app.include_router(auth_router)