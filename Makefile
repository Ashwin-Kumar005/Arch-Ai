.PHONY: install dev test lint build seed migrate docker-up docker-down clean e2e

install:
	pip install -r apps/api/requirements.txt
	cd apps/web && npm install

dev-backend:
	cd apps/api && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd apps/web && npm run dev -- -p 3000

test-backend:
	cd apps/api && pytest tests/ -v

test-frontend:
	cd apps/web && npm test -- --run

test: test-backend

e2e:
	python scripts/verify_e2e.py

seed:
	cd apps/api && python -m app.db.seed

build:
	cd apps/web && npm run build

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

clean:
	rm -rf apps/api/__pycache__ apps/web/.next apps/web/node_modules
