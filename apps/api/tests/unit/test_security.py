"""
Unit Tests for Security and Password Utilities
"""

from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)


def test_password_hashing_and_verification():
    password = "SuperSecretPassword123!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_token_lifecycle():
    data = {"sub": "user-uuid-1234", "email": "test@archai.io", "role": "admin"}
    token = create_access_token(data)
    assert isinstance(token, str)

    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "user-uuid-1234"
    assert payload["email"] == "test@archai.io"
    assert payload["role"] == "admin"


def test_invalid_jwt_token():
    payload = decode_access_token("invalid.token.structure")
    assert payload is None
