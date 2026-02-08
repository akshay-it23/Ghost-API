# 🧠 Phase 3: Testing the Analysis Engine

## What We Just Built:

The **Analysis Engine** - the "brain" that detects API risks automatically!

### 5 Detection Rules:

1. **DEAD_API** - No usage in 30+ days
2. **UNSECURED_API** - Sensitive endpoints without auth (CRITICAL!)
3. **UNSTABLE_API** - Error rate > 20% in last 7 days
4. **LOW_USAGE_API** - Less than 10 calls in 30 days
5. **ZOMBIE_API** - Deprecated but still being called

---

## 🧪 How to Test:

### Step 1: Make Sure You Have Test Data

The analysis needs data to work with. Make some API calls if you haven't:

```powershell
# Call endpoints multiple times
1..5 | ForEach-Object { Invoke-WebRequest -Uri http://localhost:5000/api/users -UseBasicParsing }
1..5 | ForEach-Object { Invoke-WebRequest -Uri http://localhost:5000/api/products -UseBasicParsing }

# Call admin endpoint WITHOUT auth (will trigger UNSECURED_API)
Invoke-WebRequest -Uri http://localhost:5000/api/admin/delete -Method DELETE -UseBasicParsing

# Call unstable endpoint (30% will error - triggers UNSTABLE_API)
1..20 | ForEach-Object { 
    try { Invoke-WebRequest -Uri http://localhost:5000/api/unstable -UseBasicParsing } 
    catch { Write-Host "Error (expected)" }
}
```

### Step 2: Run the Analysis Engine

```bash
node scripts/run-analysis.js
```

### Step 3: Watch the Output

You should see:
```
🚀 GhostAPI Analysis Engine
============================

🔍 Starting API risk analysis...
🗑️  Cleared old risks

🔍 Checking for dead APIs...

🔍 Checking for unsecured APIs...
  ⚠️  UNSECURED_API: endpoint 4

🔍 Checking for unstable APIs...
  ⚠️  UNSTABLE_API: endpoint 6

🔍 Checking for low usage APIs...

🔍 Checking for zombie APIs...

✅ Analysis complete!
📊 Total risks detected: 2
```

### Step 4: Check Database

Open Prisma Studio:
```bash
npx prisma studio
```

Go to **api_risk** table - you should see:
- Risk records with riskType, severity, explanation
- Links to endpoints (endpointId)
- Timestamps (detectedAt)

---

## ✅ What to Verify:

- [ ] Analysis script runs without errors
- [ ] Console shows detection messages
- [ ] **UNSECURED_API** detected for `/api/admin/delete`
- [ ] **UNSTABLE_API** detected for `/api/unstable` (if enough errors)
- [ ] api_risk table has records
- [ ] Each risk has human-readable explanation
- [ ] Severity levels are correct (CRITICAL, HIGH, MEDIUM, LOW)

---

## 🎯 Expected Risks:

Based on your test data, you should see:

1. **UNSECURED_API** (CRITICAL)
   - Endpoint: DELETE /api/admin/delete
   - Reason: Sensitive endpoint accessed without auth

2. **UNSTABLE_API** (HIGH) - if you called `/unstable` enough times
   - Endpoint: GET /api/unstable
   - Reason: High error rate (30%)

3. **LOW_USAGE_API** (LOW) - possibly for `/deprecated-endpoint`
   - Reason: Very few calls

---

## 🧪 Advanced Testing:

### Test Dead API Detection:
To test this, you'd need an endpoint with no hits in 30 days. For now, you can:
1. Manually insert an old endpoint in database
2. Or wait 30 days (not practical!)
3. Or modify the code to use 1 minute instead of 30 days for testing

### Test Zombie API Detection:
```sql
-- In Prisma Studio, mark an endpoint as deprecated
UPDATE api_endpoint SET deprecated = true WHERE path = '/api/deprecated-endpoint';
```

Then call it and run analysis again.

---

## 📊 How It Works:

```
1. Analysis script runs
2. Clears old risks (fresh start)
3. Runs 5 detection rules:
   - Queries database for patterns
   - Checks thresholds
   - Creates risk records
4. Stores risks in api_risk table
5. Shows summary
```

---

## 🐛 Troubleshooting:

**No risks detected:**
- Make sure you have API hits in database
- Check that you called `/admin/delete` without auth
- Verify `/unstable` endpoint was called enough times

**Script errors:**
- Make sure server is running
- Check DATABASE_URL in .env
- Verify Prisma client is generated

**"Cannot find module":**
- Run from project root: `node scripts/run-analysis.js`

---

## 🎉 Once Verified:

When you see risks in the database with proper explanations, **Phase 3 is complete!**

Next: **Phase 4 - Dashboard APIs** (serve this data to frontend)
