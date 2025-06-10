// Glossary of datetime-related terms and concepts
export interface GlossaryItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  relatedTerms: string[];
  references?: string[];
  category: 'standard' | 'format' | 'concept' | 'timezone' | 'calculation';
}

export const glossaryItems: Record<string, GlossaryItem> = {
  'utc': {
    id: 'utc',
    title: 'UTC (Coordinated Universal Time)',
    shortDescription: 'The primary time standard by which the world regulates clocks and time.',
    longDescription: `Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time. It is the basis for civil time today and is used across the internet, in aviation, maritime operations, and many scientific applications.

UTC is maintained by a network of atomic clocks around the world and is closely related to, but distinct from, Greenwich Mean Time (GMT). Unlike local time zones, UTC does not change with the seasons and is not affected by Daylight Saving Time.

UTC is the time standard used for many systems requiring precision timekeeping, including the Internet, GPS satellites, and international air traffic control. Computer systems often use UTC internally and then convert to local time for display purposes.

The term "Coordinated Universal Time" is a compromise between the English "Coordinated Universal Time" and the French "Temps Universel Coordonné", which is why the acronym UTC doesn't match either language exactly.`,
    relatedTerms: ['gmt', 'atomic-time', 'leap-second', 'timezone'],
    references: [
      'International Telecommunication Union (ITU)',
      'International Bureau of Weights and Measures (BIPM)'
    ],
    category: 'standard'
  },
  'gmt': {
    id: 'gmt',
    title: 'GMT (Greenwich Mean Time)',
    shortDescription: 'The mean solar time at the Royal Observatory in Greenwich, London.',
    longDescription: `Greenwich Mean Time (GMT) is the mean solar time at the Royal Observatory in Greenwich, London. It was historically used as the international civil time standard before being replaced in scientific contexts by Coordinated Universal Time (UTC).

GMT was established in 1675 when the Royal Observatory was built as a reference time for nautical purposes and the British navy. It became the global time standard in 1884 at the International Meridian Conference, where the Greenwich meridian was adopted as the Prime Meridian (0° longitude).

Today, GMT is still used in some contexts, particularly in the United Kingdom during winter months, but has largely been superseded by UTC for scientific and technical purposes. The term GMT is often used informally to refer to UTC+0, though technically they can differ by up to 0.9 seconds due to leap seconds and other adjustments in UTC.

Unlike UTC, which is based on atomic time, GMT is based on astronomical observations and the rotation of the Earth, which is slightly irregular.`,
    relatedTerms: ['utc', 'prime-meridian', 'timezone'],
    category: 'standard'
  },
  'iso-8601': {
    id: 'iso-8601',
    title: 'ISO 8601 (Date and Time Format)',
    shortDescription: 'International standard for representing dates and times.',
    longDescription: `ISO 8601 is an international standard for representing dates and times. It was published by the International Organization for Standardization (ISO) and provides a well-defined, unambiguous method for representing dates and times, making it ideal for international communication and computer systems.

The standard follows the format YYYY-MM-DDThh:mm:ss.sssZ, where:
- YYYY represents the year
- MM represents the month
- DD represents the day
- T is a separator indicating the start of the time element
- hh represents hours (in 24-hour format)
- mm represents minutes
- ss represents seconds
- .sss represents fractions of seconds (optional)
- Z indicates that the time is in UTC (or +/-hh:mm can be used to indicate an offset from UTC)

Examples:
- 2023-04-15T14:30:00Z (2:30 PM UTC on April 15, 2023)
- 2023-04-15T14:30:00+02:00 (2:30 PM in a timezone 2 hours ahead of UTC)

ISO 8601 is widely used in computing, data exchange, and APIs because it eliminates ambiguity in date representations (such as whether 04/05/2023 means April 5 or May 4) and is easily sortable.`,
    relatedTerms: ['utc', 'rfc-3339', 'timestamp'],
    references: ['International Organization for Standardization (ISO)'],
    category: 'format'
  },
  'unix-timestamp': {
    id: 'unix-timestamp',
    title: 'Unix Timestamp',
    shortDescription: 'The number of seconds that have elapsed since January 1, 1970 (UTC).',
    longDescription: `A Unix timestamp (also known as Unix time, POSIX time, or Epoch time) is a system for representing a point in time as the number of seconds that have elapsed since January 1, 1970, at 00:00:00 UTC, excluding leap seconds.

This date (January 1, 1970) is referred to as the Unix Epoch, and it serves as the reference point from which time is measured in Unix and many other computer systems.

Unix timestamps are widely used in computing because they provide a compact, language-independent representation of a specific moment in time. They are particularly useful for storing dates and times in databases and for performing date/time calculations.

Examples:
- 0: January 1, 1970, 00:00:00 UTC (the Epoch)
- 1000000000: September 9, 2001, 01:46:40 UTC
- 1585000000: March 24, 2020, 00:00:00 UTC

Most programming languages provide functions to convert between Unix timestamps and human-readable date formats. Unix timestamps typically don't account for leap seconds, which means they don't precisely track UTC during leap second adjustments.`,
    relatedTerms: ['epoch', 'utc', 'posix-time'],
    category: 'format'
  },
  'timezone': {
    id: 'timezone',
    title: 'Time Zone',
    shortDescription: 'A region of the globe that observes a uniform standard time for legal, commercial, and social purposes.',
    longDescription: `A time zone is a region of the globe that observes a uniform standard time for legal, commercial, and social purposes. Time zones are defined as areas that differ from Coordinated Universal Time (UTC) by a whole number of hours, although some are offset by 30 or 45 minutes.

Time zones were first adopted in the late 19th century to standardize local time, which previously varied from town to town based on solar time. The concept was formalized following the 1884 International Meridian Conference, which established the Greenwich meridian as the Prime Meridian (0° longitude).

Most time zones are defined as offsets from UTC. For example:
- UTC-5 (Eastern Standard Time in North America)
- UTC+1 (Central European Time)
- UTC+8 (China Standard Time)

Many regions also observe Daylight Saving Time (DST), temporarily shifting their clocks forward by one hour during summer months to extend evening daylight.

Time zones are typically identified using various naming conventions:
- IANA/Olson time zone database identifiers (e.g., "America/New_York", "Europe/London")
- Abbreviations (e.g., EST, CST, PST)
- UTC offset notations (e.g., UTC+2, UTC-7)

The IANA time zone database is the most comprehensive and widely used system for identifying time zones in computing applications.`,
    relatedTerms: ['utc', 'dst', 'iana-timezone-database'],
    category: 'concept'
  },
  'dst': {
    id: 'dst',
    title: 'Daylight Saving Time (DST)',
    shortDescription: 'The practice of advancing clocks during summer months to extend evening daylight.',
    longDescription: `Daylight Saving Time (DST) is the practice of advancing clocks (typically by one hour) during summer months to extend evening daylight and reduce artificial light usage. The exact dates for DST transitions vary by country and region.

The modern concept of DST was first proposed by George Vernon Hudson in 1895 and was first implemented during World War I as a way to conserve coal. Today, about 40% of countries worldwide use DST, with notable exceptions including most of Africa and Asia.

DST transitions can cause various complications:
- In spring, clocks "spring forward" (e.g., from 2:00 AM to 3:00 AM), resulting in one hour being skipped
- In fall, clocks "fall back" (e.g., from 2:00 AM to 1:00 AM), resulting in one hour occurring twice

These transitions create challenges for scheduling, sleep patterns, and computer systems. In computing, handling DST correctly requires awareness of the specific rules for each time zone, which can change due to policy decisions.

The effectiveness and necessity of DST have been debated, with critics pointing to disruptions in sleep patterns, potential health impacts, and the complexity it adds to timekeeping systems. Some regions have moved to abolish the practice in favor of maintaining a consistent time year-round.`,
    relatedTerms: ['timezone', 'standard-time'],
    category: 'concept'
  },
  'leap-second': {
    id: 'leap-second',
    title: 'Leap Second',
    shortDescription: 'A one-second adjustment occasionally added to UTC to accommodate irregularities in Earth\'s rotation.',
    longDescription: `A leap second is a one-second adjustment that is occasionally added to Coordinated Universal Time (UTC) to accommodate the irregular rotation of the Earth. Unlike leap years, which follow a regular pattern, leap seconds are inserted irregularly based on astronomical observations.

The Earth's rotation is gradually slowing due to tidal friction and other factors, making the mean solar day slightly longer than 86,400 seconds (the number of SI seconds in a standard day). To keep UTC within 0.9 seconds of UT1 (the time standard based on Earth's rotation), leap seconds are added when necessary.

Since their introduction in 1972, leap seconds have typically been added at a rate of about one every 18 months, though the frequency varies. They are usually scheduled for June 30 or December 31, where 23:59:59 is followed by 23:59:60 before rolling over to 00:00:00 of the next day.

Leap seconds pose challenges for computer systems, which often aren't designed to handle a 61-second minute. Various strategies exist for implementing leap seconds in computing:
- Smearing the extra second over a longer period
- Handling the extra second as a special case
- Stepping the clock backward after the leap second

Due to these complications, there have been proposals to eliminate leap seconds in favor of allowing UTC to gradually drift from UT1, with occasional larger adjustments made after much longer intervals.`,
    relatedTerms: ['utc', 'atomic-time', 'ut1'],
    references: ['International Earth Rotation and Reference Systems Service (IERS)'],
    category: 'calculation'
  },
  'atomic-time': {
    id: 'atomic-time',
    title: 'Atomic Time (TAI)',
    shortDescription: 'A high-precision time standard based on the oscillation of atoms.',
    longDescription: `Atomic time, officially known as International Atomic Time (TAI, from the French "Temps Atomique International"), is a high-precision time standard based on the resonance frequency of atoms. It provides a continuous, stable time scale that is not affected by irregularities in Earth's rotation.

TAI is determined by a worldwide network of atomic clocks that measure time based on the electromagnetic radiation emitted by cesium-133 atoms during a specific energy level transition. The second in TAI is defined as the duration of 9,192,631,770 cycles of this radiation, which is the official SI definition of the second.

Unlike UTC (Coordinated Universal Time), TAI does not include leap seconds and therefore runs continuously without adjustments. As a result, as of 2023, TAI is ahead of UTC by 37 seconds due to the leap seconds that have been added to UTC since 1972.

The relationship between TAI and UTC is:
UTC = TAI - (number of leap seconds)

Atomic time is crucial for applications requiring extremely precise timekeeping, such as global navigation satellite systems (like GPS), scientific research, and telecommunications. However, for everyday civil timekeeping, UTC is used instead because it stays approximately synchronized with the Earth's rotation.`,
    relatedTerms: ['utc', 'leap-second', 'cesium-clock'],
    references: ['International Bureau of Weights and Measures (BIPM)'],
    category: 'standard'
  },
  'julian-date': {
    id: 'julian-date',
    title: 'Julian Date',
    shortDescription: 'A continuous count of days since noon Universal Time on January 1, 4713 BCE.',
    longDescription: `The Julian Date (JD) is a continuous count of days and fractions of days since noon Universal Time on January 1, 4713 BCE (in the proleptic Julian calendar). It was introduced by astronomers to provide a single system of dates that could be used when working with different calendars and to simplify calculations involving intervals between dates.

The Julian Date system was proposed by Joseph Scaliger in 1583 and named after his father, Julius Caesar Scaliger, not after the Julian calendar. The starting point (Julian Day 0) was chosen because it is before recorded history and because it is the point at which three major cycles used in ancient chronology coincided.

Julian Dates are expressed as a decimal number, where the integer part represents the day number and the fractional part represents the time of day. For example:
- JD 2451545.0 corresponds to noon on January 1, 2000 (UTC)
- JD 2459000.5 corresponds to midnight on May 31, 2020 (UTC)

A variant called the Modified Julian Date (MJD) is defined as MJD = JD - 2400000.5, which both reduces the number of digits and places the integer boundary at midnight rather than noon.

Julian Dates are primarily used in astronomy, space science, and satellite tracking, where they simplify calculations involving time intervals and eliminate complications from calendar irregularities.`,
    relatedTerms: ['modified-julian-date', 'gregorian-calendar', 'astronomical-time'],
    category: 'format'
  },
  'epoch': {
    id: 'epoch',
    title: 'Epoch',
    shortDescription: 'A reference point in time used as the origin for a particular time measurement system.',
    longDescription: `In timekeeping, an epoch is a reference point in time used as the origin for a particular time measurement system. Different systems use different epochs as their starting points for counting time.

Some notable epochs include:

1. Unix Epoch: January 1, 1970, 00:00:00 UTC - Used for Unix timestamps, which count the number of seconds since this moment.

2. GPS Epoch: January 6, 1980, 00:00:00 UTC - The starting point for GPS time, which counts weeks and seconds within each week.

3. J2000 Epoch: January 1, 2000, 12:00:00 TT (Terrestrial Time) - A standard reference epoch used in astronomy and space science.

4. Microsoft Windows Epoch: January 1, 1601, 00:00:00 UTC - Used in NTFS file systems and some Windows APIs.

5. NTP Epoch: January 1, 1900, 00:00:00 UTC - Used in the Network Time Protocol.

Epochs are chosen for various practical or historical reasons. For example, the Unix Epoch was chosen to be compatible with the limitations of 32-bit integers when Unix was developed, while astronomical epochs are often chosen to coincide with significant astronomical events or periods.

When working with different time systems, it's important to be aware of their respective epochs to correctly convert between them.`,
    relatedTerms: ['unix-timestamp', 'gps-time', 'j2000'],
    category: 'concept'
  }
};
