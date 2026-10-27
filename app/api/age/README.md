# Age API

`GET /api/age?birthdate=YYYY-MM-DD[&targetDate=YYYY-MM-DD][&utcOffset=±HH:MM]`

- `birthdate` (required): date of birth.
- `targetDate` (optional): age as of this date; defaults to today.
- `utcOffset` (optional): only decides what "today" is when `targetDate` is omitted (`+08:00`, `-5`, or minutes). Default UTC.

Age is a calendar-date difference, so it does not depend on the server's time zone. When the birth day does
not exist in the anniversary month (e.g. Jan 31 -> Feb), the anniversary is clamped to the month end.

```
/api/age?birthdate=2007-06-15&targetDate=2026-09-14
{"birthdate":"2007-06-15","targetDate":"2026-09-14","utcOffset":{"minutes":0,"label":"+00:00"},
 "age":{"years":19,"months":2,"days":30,"totalDays":7031,"totalMonths":230,"totalWeeks":1004,
        "decimalAge":19.25,"formatted":{"readable":"19 years and 2 months","ymd":"19 years, 2 months, 30 days","short":"19y 2m 30d"}}}
```

Errors return HTTP 400 with `{ "error": "...", "usage": "..." }`.
