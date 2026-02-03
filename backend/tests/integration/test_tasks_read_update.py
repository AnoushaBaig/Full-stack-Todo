from __future__ import annotations


def test_read_and_update_task_success(client, make_auth_header) -> None:
    user_a = "user_a"

    r_create = client.post(
        f"/api/{user_a}/tasks",
        json={"title": "Original", "description": "D1"},
        headers=make_auth_header(user_a),
    )
    assert r_create.status_code == 201, r_create.text
    task_id = r_create.json()["id"]

    r_read = client.get(f"/api/{user_a}/tasks/{task_id}", headers=make_auth_header(user_a))
    assert r_read.status_code == 200, r_read.text
    assert r_read.json()["title"] == "Original"

    r_put = client.put(
        f"/api/{user_a}/tasks/{task_id}",
        json={"title": "Updated", "description": "D2"},
        headers=make_auth_header(user_a),
    )
    assert r_put.status_code == 200, r_put.text
    assert r_put.json()["title"] == "Updated"

    r_read2 = client.get(f"/api/{user_a}/tasks/{task_id}", headers=make_auth_header(user_a))
    assert r_read2.status_code == 200, r_read2.text
    assert r_read2.json()["title"] == "Updated"


def test_read_nonexistent_task_is_404(client, make_auth_header) -> None:
    user_a = "user_a"

    r = client.get(f"/api/{user_a}/tasks/999999", headers=make_auth_header(user_a))
    assert r.status_code == 404, r.text
    body = r.json()
    assert body["code"] == "TASK_NOT_FOUND"


def test_cross_user_task_access_returns_404(client, make_auth_header) -> None:
    user_a = "user_a"
    user_b = "user_b"

    r_create = client.post(
        f"/api/{user_a}/tasks",
        json={"title": "A task", "description": None},
        headers=make_auth_header(user_a),
    )
    assert r_create.status_code == 201, r_create.text
    task_id = r_create.json()["id"]

    # user_b cannot access user_a's task; scoped lookup returns 404
    r = client.get(f"/api/{user_b}/tasks/{task_id}", headers=make_auth_header(user_b))
    assert r.status_code == 404, r.text
    body = r.json()
    assert body["code"] == "TASK_NOT_FOUND"
