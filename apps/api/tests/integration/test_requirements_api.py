"""
Integration Tests for Requirement Analysis, Follow-up Q&A and Finalization
"""

def test_requirements_analysis_and_finalization(client):
    # 1. Create a project
    create_res = client.post("/api/v1/projects", json={
        "name": "E-Learning Platform",
        "raw_idea": "An interactive live video learning platform with quizzes and certificates."
    })
    project_id = create_res.json()["id"]

    # 2. Analyze Idea
    analyze_res = client.post(f"/api/v1/projects/{project_id}/analyze")
    assert analyze_res.status_code == 200
    analysis_data = analyze_res.json()
    assert "project_summary" in analysis_data
    assert "open_questions" in analysis_data
    assert len(analysis_data["open_questions"]) > 0

    # 3. Get Requirements state
    get_req_res = client.get(f"/api/v1/projects/{project_id}/requirements")
    assert get_req_res.status_code == 200
    req_data = get_req_res.json()
    questions = req_data["questions"]
    assert len(questions) > 0

    # 4. Answer Questions
    answers_payload = {
        "answers": [
            {
                "question_id": questions[0]["id"],
                "selected_option": questions[0]["options"][0] if questions[0]["options"] else "Standard",
                "custom_text": "Prefer cloud-hosted managed provider."
            }
        ]
    }
    answer_res = client.post(f"/api/v1/projects/{project_id}/questions/answer", json=answers_payload)
    assert answer_res.status_code == 200

    # 5. Finalize Requirements
    finalize_res = client.post(f"/api/v1/projects/{project_id}/finalize", json={})
    assert finalize_res.status_code == 200
    final_data = finalize_res.json()
    assert final_data["is_finalized"] is True
    assert final_data["finalized_srs"] is not None
