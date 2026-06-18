from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Date,
    ForeignKey
)

from app.database import Base


class Asset(Base):
    __tablename__ = "assets"

    asset_id = Column(
        Integer,
        primary_key=True
    )

    account_id = Column(
        Integer,
        ForeignKey("accounts.account_id")
    )

    asset_type = Column(
        String
    )

    asset_name = Column(
        String
    )

    description = Column(
        String(500)
    )

    current_value = Column(
        Numeric(12, 2)
    )

    purchase_date = Column(
        Date
    )