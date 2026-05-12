from fastapi import HTTPException, Request, status

from app.core.redis import get_redis


async def check_rate_limit(request: Request, key_suffix: str, limit: int, window_seconds: int) -> None:
    """Sliding-window rate limiter using Redis INCR + EXPIRE."""
    client_ip = request.client.host if request.client else "unknown"
    key = f"rate_limit:{key_suffix}:{client_ip}"
    redis = get_redis()

    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, window_seconds)

    if count > limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Zu viele Anfragen. Bitte warte {window_seconds} Sekunden.",
        )
