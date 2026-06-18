from pydantic import BaseModel
from datetime import date


class AssetCreate(BaseModel):
    account_id: int
    asset_type: str
    asset_name: str
    description: str
    current_value: float
    purchase_date: date


class AssetUpdate(BaseModel):
    asset_type: str
    asset_name: str
    description: str
    current_value: float


class AssetResponse(AssetCreate):
    asset_id: int

    class Config:
        from_attributes = True