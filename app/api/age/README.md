# Age Calculator API

This API endpoint calculates a person's age from their date of birth.

## Endpoint

```
GET /api/age
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `birthdate` | string | Yes | Date of birth in YYYY-MM-DD format (e.g., 2007-01-15) |
| `targetDate` | string | No | Target date for age calculation in YYYY-MM-DD format (defaults to current date) |

## Example Requests

### Calculate current age
```bash
curl "https://datetime.app/api/age?birthdate=2007-01-15"
```

### Calculate age at a specific date
```bash
curl "https://datetime.app/api/age?birthdate=2007-01-15&targetDate=2025-10-17"
```

## Example Response

```json
{
  "birthdate": "2007-01-15",
  "targetDate": "2025-10-17",
  "age": {
    "years": 18,
    "months": 9,
    "days": 2,
    "totalDays": 6849,
    "totalMonths": 225,
    "decimalAge": 18.76,
    "formatted": {
      "readable": "18 years and 9 months",
      "full": "18 years, 9 months, 2 days, 0 hours, 0 minutes, 0 seconds",
      "short": "18y 9m 2d",
      "ymd": "18 years, 9 months, 2 days",
      "decimal": "18.76 years"
    }
  }
}
```

## Error Responses

### Missing birthdate parameter
```json
{
  "error": "birthdate parameter is required",
  "usage": "?birthdate=YYYY-MM-DD&targetDate=YYYY-MM-DD (targetDate is optional, defaults to current date)"
}
```

### Invalid date format
```json
{
  "error": "Invalid birthdate format. Use YYYY-MM-DD format (e.g., 1990-01-15)"
}
```

### Future birthdate
```json
{
  "error": "Birth date cannot be in the future relative to target date"
}
```

## Use Cases

- Calculate someone's exact age in years and months
- Get consistent, accurate age calculations (avoiding issues like "54 weeks" or "13 months")
- Calculate age at any point in time (historical or future)
- Display age in multiple formats (readable, decimal, detailed)
