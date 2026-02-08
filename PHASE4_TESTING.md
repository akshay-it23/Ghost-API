# 📊 Phase 4: Testing Dashboard APIs

## What We Just Built:

**5 REST API endpoints** for the dashboard:

1. **GET /api/analytics/overview** - Summary statistics
2. **GET /api/analytics/risks** - All detected risks
3. **GET /api/analytics/endpoints** - All endpoints with stats
4. **GET /api/analytics/endpoint/:id** - Specific endpoint details
5. **GET /api/analytics/endpoint/:id/timeline** - Usage timeline

---

## 🧪 How to Test:

### Prerequisites:
Make sure you have:
1. ✅ Server running (`npm run dev`)
2. ✅ Some API hits in database
3. ✅ Run analysis at least once (`node scripts/run-analysis.js`)

### Test Each Endpoint:

#### 1. Overview Statistics
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/overview -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "totalApis": 6,
  "totalRisks": 2,
  "risksByType": [
    { "riskType": "UNSECURED_API", "_count": 1 },
    { "riskType": "UNSTABLE_API", "_count": 1 }
  ],
  "risksBySeverity": [
    { "severity": "CRITICAL", "_count": 1 },
    { "severity": "HIGH", "_count": 1 }
  ]
}
```

#### 2. All Risks
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/risks -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "endpointId": 4,
    "riskType": "UNSECURED_API",
    "severity": "CRITICAL",
    "explanation": "API /api/admin/delete (DELETE) is a sensitive endpoint...",
    "detectedAt": "2026-02-09T00:00:00.000Z",
    "endpoint": {
      "id": 4,
      "path": "/api/admin/delete",
      "method": "DELETE",
      "deprecated": false,
      "createdAt": "2026-02-08T22:00:00.000Z"
    }
  }
]
```

#### 3. All Endpoints
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/endpoints -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "path": "/api/users",
    "method": "GET",
    "deprecated": false,
    "createdAt": "2026-02-08T22:00:00.000Z",
    "_count": {
      "hits": 15,
      "risks": 0
    }
  }
]
```

#### 4. Endpoint Details (replace :id with actual endpoint ID)
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/endpoint/1 -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "id": 1,
  "path": "/api/users",
  "method": "GET",
  "deprecated": false,
  "createdAt": "2026-02-08T22:00:00.000Z",
  "hits": [
    {
      "id": 1,
      "endpointId": 1,
      "statusCode": 200,
      "responseTime": 45,
      "authPresent": false,
      "timestamp": "2026-02-08T22:30:00.000Z"
    }
  ],
  "risks": []
}
```

#### 5. Usage Timeline
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/endpoint/1/timeline -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
[
  {
    "date": "2026-02-08",
    "count": 10,
    "errors": 0
  },
  {
    "date": "2026-02-09",
    "count": 5,
    "errors": 1
  }
]
```

---

## ✅ What to Verify:

- [ ] All 5 endpoints return valid JSON
- [ ] Overview shows correct counts
- [ ] Risks include endpoint details (nested object)
- [ ] Endpoints list shows hit/risk counts
- [ ] Endpoint details include hits and risks arrays
- [ ] Timeline groups data by date
- [ ] No 500 errors
- [ ] Response times are fast (< 500ms)

---

## 🎯 Quick Test Script:

Run all tests at once:

```powershell
# Test all endpoints
Write-Host "Testing Overview..." -ForegroundColor Cyan
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/overview -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json

Write-Host "`nTesting Risks..." -ForegroundColor Cyan
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/risks -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json

Write-Host "`nTesting Endpoints..." -ForegroundColor Cyan
Invoke-WebRequest -Uri http://localhost:5000/api/analytics/endpoints -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json

Write-Host "`nAll tests complete!" -ForegroundColor Green
```

---

## 🐛 Troubleshooting:

**Empty responses:**
- Run analysis first: `node scripts/run-analysis.js`
- Make sure you have API hits in database

**404 errors:**
- Check server restarted (nodemon should auto-restart)
- Verify routes are registered in server.js

**500 errors:**
- Check console for error messages
- Verify Prisma client is working
- Check database connection

**"Endpoint not found" for endpoint/:id:**
- Use a valid endpoint ID from database
- Check Prisma Studio for actual IDs

---

## 📊 API Documentation Summary:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analytics/overview` | GET | Dashboard summary stats |
| `/api/analytics/risks` | GET | All detected risks |
| `/api/analytics/endpoints` | GET | All endpoints with counts |
| `/api/analytics/endpoint/:id` | GET | Specific endpoint details |
| `/api/analytics/endpoint/:id/timeline` | GET | Daily usage timeline |

---

## 🎉 Once Verified:

When all endpoints return valid data, **Phase 4 is complete!**

Next: **Phase 5 - Frontend Dashboard** (React UI to visualize all this data)
