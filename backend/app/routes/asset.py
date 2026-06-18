from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.asset import Asset
from app.models.account import Account

from app.schemas.asset import (
    AssetCreate,
    AssetUpdate
)

router = APIRouter(
    prefix="/assets",
    tags=["Assets"]
)

@router.post("/")
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db)
):
    account = (
        db.query(Account)
        .filter(
            Account.account_id ==
            asset.account_id
        )
        .first()
    )

    if not account:
        raise HTTPException(
            status_code=404,
            detail="Account not found"
        )

    new_asset = Asset(
        account_id=asset.account_id,
        asset_type=asset.asset_type,
        asset_name=asset.asset_name,
        description=asset.description,
        current_value=asset.current_value,
        purchase_date=asset.purchase_date
    )

    db.add(new_asset)

    db.commit()

    db.refresh(new_asset)

    return new_asset

@router.get("/user/{user_id}")
def get_assets_by_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Asset)
        .join(Account)
        .filter(
            Account.user_id == user_id
        )
        .all()
    )

@router.get("/{asset_id}")
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(
            Asset.asset_id == asset_id
        )
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    return asset

@router.put("/{asset_id}")
def update_asset(
    asset_id: int,
    asset_update: AssetUpdate,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(
            Asset.asset_id == asset_id
        )
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    asset.asset_type = (
        asset_update.asset_type
    )

    asset.asset_name = (
        asset_update.asset_name
    )

    asset.description = (
        asset_update.description
    )

    asset.current_value = (
        asset_update.current_value
    )

    db.commit()

    db.refresh(asset)

    return asset

@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(
            Asset.asset_id == asset_id
        )
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    db.delete(asset)

    db.commit()

    return {
        "message":
        "Asset deleted successfully"
    }

