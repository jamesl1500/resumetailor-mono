from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import Request
from app.models.visitor_identity_model import VisitorIdentity


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()

    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()

    if request.client and request.client.host:
        return request.client.host

    return "unknown"


def track_visitor_by_ip(db: Session, ip_address: str, user_id=None) -> VisitorIdentity:
    visitor = db.query(VisitorIdentity).filter(VisitorIdentity.ip_address == ip_address).first()
    now = datetime.utcnow()

    if not visitor:
        visitor = VisitorIdentity(
            ip_address=ip_address,
            user_id=user_id,
            first_seen=now,
            last_seen=now,
            visit_count=1,
        )
        db.add(visitor)
    else:
        visitor.last_seen = now
        visitor.visit_count = (visitor.visit_count or 0) + 1
        if user_id is not None:
            visitor.user_id = user_id

    db.commit()
    db.refresh(visitor)
    return visitor


def link_visitor_ip_to_user(db: Session, ip_address: str, user_id):
    visitors = db.query(VisitorIdentity).filter(VisitorIdentity.ip_address == ip_address).all()
    now = datetime.utcnow()

    if not visitors:
        visitor = VisitorIdentity(
            ip_address=ip_address,
            user_id=user_id,
            first_seen=now,
            last_seen=now,
            visit_count=1,
        )
        db.add(visitor)
    else:
        for visitor in visitors:
            visitor.user_id = user_id
            visitor.last_seen = now

    db.commit()


def get_user_id_for_ip(db: Session, ip_address: str):
    visitor = (
        db.query(VisitorIdentity)
        .filter(
            VisitorIdentity.ip_address == ip_address,
            VisitorIdentity.user_id.isnot(None),
        )
        .order_by(VisitorIdentity.last_seen.desc())
        .first()
    )
    return visitor.user_id if visitor else None
