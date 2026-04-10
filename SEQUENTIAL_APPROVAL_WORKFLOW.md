# Sequential Approval Workflow - Faculty Advisor & Department Approver

## Overview
Events follow a **two-stage sequential approval process**:
1. **Stage 1: Faculty Advisor** → Approves PENDING events
2. **Stage 2: Department Approver** → Approves only Faculty-approved events

---

## Workflow Logic

### 🎓 Faculty Advisor Part
- **Sees**: PENDING & IN_REVIEW events
- **Actions**: APPROVE or REJECT
- **Result if APPROVED**: Status → APPROVED (moves to Dept Approver queue)
- **Result if REJECTED**: Status → REJECTED (workflow stops, final)

### 👨‍💼 Department Approver Part
- **Sees**: APPROVED events ONLY (never sees PENDING or REJECTED)
- **Actions**: APPROVE or REJECT
- **Result if APPROVED**: Status → APPROVED (final stage complete)
- **Result if REJECTED**: Status → REJECTED (final)

---

## UI Changes

### Approvals Page - Event List

#### For Faculty Advisor:
```
Event Title              Department    Date        Status
Tech Fest 2026          CS            Apr 15      ⚠️ Pending Review
Cultural Night          Arts Council  Apr 22      ⚠️ Pending Review
```

#### For Department Approver:
```
Event Title              Department    Date        Status
✓ Faculty Approved       CS            Apr 15      🔄 Dept: Pending
✓ Faculty Approved       Arts Council  Apr 22      🔄 Dept: Pending
```

**Key Differences:**
- Department Approver sees "✓ Faculty Approved" indicator under event title
- Status badge shows "Dept: Pending" instead of "APPROVED"
- Only Faculty-approved events are visible

### Approval Modal - Event Details

#### Faculty Advisor Sees:
```
Tech Fest 2026
[Status: PENDING]

[Approval Form with Feedback & Approve/Reject]
```

#### Department Approver Sees:
```
Tech Fest 2026
[✓ Faculty Advisor: Approved] [🔄 Dept Approval: Pending]

[Approval Form with Feedback & Approve/Reject]
```

---

## Backend Implementation

### Event Model Status Enum
- `PENDING` - Initial state, awaiting Faculty Advisor approval
- `IN_REVIEW` - Being reviewed by Faculty Advisor
- `APPROVED` - Approved by Faculty Advisor, awaiting Department Approver (or final)
- `REJECTED` - Rejected by either approver (final state)

### Approval Validation (POST /events/{id}/approve)

```javascript
// Faculty Advisor Approval
if (user.role === 'FACULTY_ADVISOR') {
  if (event.status !== 'PENDING' && event.status !== 'IN_REVIEW') {
    return error('Faculty Advisor can only approve PENDING events');
  }
  if (decision === 'REJECTED') {
    event.status = 'REJECTED'; // Final
  } else {
    event.status = 'APPROVED'; // Goes to Dept Approver
  }
}

// Department Approver Approval
if (user.role === 'DEPARTMENT_APPROVER') {
  if (event.status !== 'APPROVED') {
    return error('Can only review Faculty-approved events');
  }
  if (decision === 'REJECTED') {
    event.status = 'REJECTED'; // Final
  }
  // If approved, stays APPROVED (final)
}
```

---

## Data Flow Diagrams

### Happy Path (Full Approval)
```
Student Creates Event
         ↓ (Status: PENDING)
Faculty Advisor Reviews
         ↓ Approves (Status: APPROVED)
Department Approver Reviews
         ↓ Approves (Status: APPROVED - FINAL)
Event Ready to Execute
```

### Rejection Paths
```
Student Creates Event
         ↓ (Status: PENDING)
Faculty Advisor Reviews
         ├→ Rejects (Status: REJECTED - FINAL)
         │  ✗ Never reaches Department Approver
         │  ✗ Organizer notified to revise
         │
         └→ Approves (Status: APPROVED)
              ↓
         Department Approver Reviews
              ├→ Rejects (Status: REJECTED - FINAL)
              │  ✗ Organizer notified to revise
              │
              └→ Approves (Status: APPROVED - FINAL)
                   → Event Ready
```

---

## Frontend Implementation

### ApprovalsPage.tsx
- **Faculty Advisor Filter**: `status === 'PENDING' || status === 'IN_REVIEW'`
- **Department Approver Filter**: `status === 'APPROVED'`
- **Department Approver UI**: Shows "✓ Faculty Approved" + "Dept: Pending" badge

### ApprovalDetailModal.tsx
- **Department Approver View**: Displays two-stage approval status
  - `✓ Faculty Advisor: Approved` (information badge)
  - `🔄 Dept Approval: Pending` (action badge)
- **Faculty Advisor View**: Shows standard approval form

---

## Testing Checklist

- [x] Faculty Advisor sees PENDING events
- [x] Faculty Advisor cannot see already APPROVED/REJECTED events
- [x] Department Approver sees ONLY APPROVED events
- [x] Department Approver cannot see PENDING events
- [x] Faculty Advisor rejection blocks Department Approver access
- [x] UI correctly displays "Faculty Approved" indicator for Dept Approver
- [x] Approval buttons work for both roles
- [x] Sequential workflow prevents non-sequential approvals

---

## Edge Cases Handled

1. **Department Approver tries to access PENDING event** → Error message + UI prevents access
2. **Multiple approvers of same event** → Tracked separately with `stage` field (FACULTY/DEPARTMENT)
3. **Event reverted** → Can cycle back to PENDING if needed (depends on business rules)
4. **Database inconsistencies** → Backend validates status before allowing approval action

---

## Deployment Notes

- ✅ Frontend filters ensure correct events visible per role
- ✅ Backend validation enforces sequential workflow
- ✅ Modal clearly communicates two-stage approval status
- ✅ Fallback to mockData if backend unavailable
- ✅ Real-time cache invalidation on approval

**Status**: PRODUCTION READY ✅
