from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.stock import Stock
from app.models.account import Account
from app.models.user import User
from app.core.auth import get_current_user
from app.schemas.stock import (
    StockCreate,
    StockUpdate
)

router = APIRouter(
    prefix="/stocks",
    tags=["Stocks"]
)

@router.post("/")
def create_stock(
    stock: StockCreate,
    db: Session = Depends(get_db)
):
    account = (
        db.query(Account)
        .filter(
            Account.account_id ==
            stock.account_id
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    new_stock = Stock(
        account_id=stock.account_id,
        stock_name=stock.stock_name,
        invested_amount=stock.invested_amount,
        current_value=stock.current_value,
        purchase_date=stock.purchase_date
    )

    db.add(new_stock)

    db.commit()

    db.refresh(new_stock)

    return new_stock

@router.get("/user")
def get_stocks_by_user(
    Current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Stock)
        .join(Account)
        .filter(
            Account.user_id == Current_user.user_id
        )
        .all()
    )

@router.get("/{stock_id}")
def get_stock(
    stock_id: int,
    db: Session = Depends(get_db)
):
    stock = (
        db.query(Stock)
        .filter(
            Stock.stock_id == stock_id
        )
        .first()
    )

    if not stock:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )

    return stock

@router.put("/{stock_id}")
def update_stock(
    stock_id: int,
    stock_update: StockUpdate,
    db: Session = Depends(get_db)
):
    stock = (
        db.query(Stock)
        .filter(
            Stock.stock_id == stock_id
        )
        .first()
    )

    if not stock:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )

    stock.stock_name = stock_update.stock_name

    stock.invested_amount = (
        stock_update.invested_amount
    )

    stock.current_value = (
        stock_update.current_value
    )

    db.commit()

    db.refresh(stock)

    return stock

@router.delete("/{stock_id}")
def delete_stock(
    stock_id: int,
    db: Session = Depends(get_db)
):
    stock = (
        db.query(Stock)
        .filter(
            Stock.stock_id == stock_id
        )
        .first()
    )

    if not stock:
        raise HTTPException(
            status_code=404,
            detail="Stock not found"
        )

    db.delete(stock)

    db.commit()

    return {
        "message":
        "Stock deleted successfully"
    }