#!/usr/bin/env bash
# Smoke test: BASE_URL=http://localhost:5000 bash smoke.sh
BASE="${BASE_URL:-http://localhost:5000}"
EMAIL="smoke$(date +%s)@example.com"
fail=0
check() { # name expected actual
  if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (expected $2, got $3)"; fail=1; fi
}
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
H='Content-Type: application/json'
check "health" 200 "$(code $BASE/api/health)"
check "signup" 201 "$(code -X POST -H "$H" -d "{\"name\":\"Smoke Test\",\"email\":\"$EMAIL\",\"password\":\"password123\"}" $BASE/api/auth/signup)"
check "login ok" 200 "$(code -X POST -H "$H" -d "{\"email\":\"$EMAIL\",\"password\":\"password123\"}" $BASE/api/auth/login)"
check "login wrong password" 401 "$(code -X POST -H "$H" -d "{\"email\":\"$EMAIL\",\"password\":\"wrongpass1\"}" $BASE/api/auth/login)"
check "me without token" 401 "$(code $BASE/api/auth/me)"
exit $fail
