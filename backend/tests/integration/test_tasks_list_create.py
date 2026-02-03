from __future__ import annotations


def test_create_then_list_returns_only_my_tasks(client, make_auth_header) -> None:
    user_a = "user_a"

    r_create = client.post(
        f"/api/{user_a}/tasks",
        json={"title": "Task A1", "description": "Desc"},
        headers=make_auth_header(user_a),
    )
    assert r_create.status_code == 201, r_create.text
    created = r_create.json()
    assert created["user_id"] == user_a
    assert created["title"] == "Task A1"

    r_list = client.get(f"/api/{user_a}/tasks", headers=make_auth_header(user_a))
    assert r_list.status_code == 200, r_list.text
    tasks = r_list.json()
    assert isinstance(tasks, list)
    assert len(tasks) == 1
    assert tasks[0]["id"] == created["id"]


def test_cross_user_list_is_forbidden_if_path_mismatch(client, make_auth_header) -> None:
    user_a = "user_a"
    user_b = "user_b"

    r = client.get(f"/api/{user_b}/tasks", headers=make_auth_header(user_a))
    assert r.status_code == 403, r.text
    body = r.json()
    assert body["code"] == "AUTH_FORBIDDEN"


def test_missing_auth_is_401(client) -> None:
    user_a = "user_a"

    r = client.get(f"/api/{user_a}/tasks")
    assert r.status_code == 401, r.text
    body = r.json()
    assert body["code"] == "AUTH_UNAUTHORIZED"
