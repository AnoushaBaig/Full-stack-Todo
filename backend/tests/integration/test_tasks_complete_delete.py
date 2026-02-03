from __future__ import annotations


def test_complete_task_sets_completed_true(client, make_auth_header) -> None:
    user_a = "user_a"

    r_create = client.post(
        f"/api/{user_a}/tasks",
        json={"title": "Do it", "description": None},
        headers=make_auth_header(user_a),
    )
    assert r_create.status_code == 201, r_create.text
    task_id = r_create.json()["id"]

    r_patch = client.patch(
        f"/api/{user_a}/tasks/{task_id}/complete",
        headers=make_auth_header(user_a),
    )
    assert r_patch.status_code == 200, r_patch.text
    assert r_patch.json()["completed"] is True

    r_read = client.get(f"/api/{user_a}/tasks/{task_id}", headers=make_auth_header(user_a))
    assert r_read.status_code == 200, r_read.text
    assert r_read.json()["completed"] is True


def test_delete_task_then_read_is_404(client, make_auth_header) -> None:
    user_a = "user_a"

    r_create = client.post(
        f"/api/{user_a}/tasks",
        json={"title": "Delete me", "description": None},
        headers=make_auth_header(user_a),
    )
    assert r_create.status_code == 201, r_create.text
    task_id = r_create.json()["id"]

    r_del = client.delete(f"/api/{user_a}/tasks/{task_id}", headers=make_auth_header(user_a))
    assert r_del.status_code == 204, r_del.text

    r_read = client.get(f"/api/{user_a}/tasks/{task_id}", headers=make_auth_header(user_a))
    assert r_read.status_code == 404, r_read.text
    body = r_read.json()
    assert body["code"] == "TASK_NOT_FOUND"
