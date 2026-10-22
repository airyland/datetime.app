/** Editorial copy for the countdown pages (English only). Rendered on the server so crawlers see it. */
export type HolidayContent = {
  /** one-line rule for how the date is set */
  rule: string
  origin: string[]
  traditions: string[]
  around: string
  faq: { q: string; a: string }[]
}

export const CONTENT: Record<string, HolidayContent> = {
  christmas: {
    rule: "December 25 every year (Gregorian calendar)",
    origin: [
      "Christmas celebrates the birth of Jesus Christ and has been observed on December 25 in the Western church since at least the fourth century. The date was chosen well after the event itself and coincides with the winter solstice festivals of the Roman world, which helped the feast spread across Europe.",
      "Over the centuries the religious holiday absorbed local customs such as evergreen decorations, gift giving, feasting and carols. Today it is both a religious festival and a secular family holiday, and it is the most widely observed public holiday in the world.",
    ],
    traditions: ["Decorating a Christmas tree and lighting the house", "Exchanging gifts on Christmas Eve or Christmas morning", "Midnight Mass and carol services", "A family meal, often roast turkey, ham, goose or a regional dish", "Sending cards and calling relatives who live far away"],
    around: "Most Western churches celebrate on December 25. Many Orthodox churches, including those in Russia, Serbia and Ethiopia, follow the Julian calendar and celebrate on January 7. In Spain and Latin America the main celebration is often Nochebuena on the 24th, and in the Netherlands and Germany gifts also arrive on December 5 or 6.",
    faq: [
      { q: "How many sleeps until Christmas?", a: "The number of sleeps is the number of nights before the morning of December 25, which equals the number of days shown in the large counter. Tomorrow being Christmas Eve means one more sleep after tonight." },
      { q: "Is Christmas always on the same weekday?", a: "No. The date is fixed, but the weekday moves forward by one each year, and by two after a leap year." },
      { q: "Why do some countries celebrate Christmas on January 7?", a: "Churches that still use the Julian calendar, which runs 13 days behind the Gregorian calendar, reach December 25 on January 7 of the Gregorian calendar." },
    ],
  },
  "christmas-eve": {
    rule: "December 24 every year",
    origin: [
      "Christmas Eve is the night before Christmas Day. In the traditional church calendar a day begins at sunset, so the Christmas feast begins on the evening of December 24, which is why services and celebrations are held that night.",
      "In many countries, among them Germany, Poland, Sweden, Spain and much of Latin America, Christmas Eve is the main family celebration, with the big meal and the opening of presents taking place that evening.",
    ],
    traditions: ["A festive dinner with the whole family", "Midnight Mass or a candlelight service", "Opening gifts in Germany, Poland, Scandinavia and Latin America", "Leaving out treats for Santa Claus in the UK, US and Canada", "Watching seasonal films and singing carols"],
    around: "It is a public holiday, or a half day, in countries such as Germany, Austria, Switzerland, Denmark, Poland and Spain. In the United States it is not a federal holiday, though many employers close early.",
    faq: [{ q: "Is Christmas Eve a public holiday?", a: "In several European countries it is a full or half public holiday. In the United States and the United Kingdom it is a normal working day, though many businesses close early." }],
  },
  "new-year": {
    rule: "January 1 every year",
    origin: [
      "January 1 has marked the start of the year in the Roman calendar since 153 BC, and the Julian and Gregorian reforms kept it. The month is named after Janus, the Roman god of doorways and beginnings, who looks both forwards and backwards.",
      "Most countries now use the Gregorian calendar for civil purposes, so New Year's Day is the most widely shared public holiday on earth, even in countries that also keep a traditional lunar or religious new year.",
    ],
    traditions: ["Making New Year's resolutions", "Parades and sporting fixtures such as the Rose Parade and bowl games", "Special foods for luck, such as lentils, grapes and black-eyed peas", "A first-footing visit in Scotland", "Visiting temples for the first prayers of the year in Japan"],
    around: "Almost every country observes January 1 as a public holiday. Some, including Japan, extend it into a multi-day break, and in several countries a holiday that falls on a weekend is moved to the next working day.",
    faq: [{ q: "Which country sees New Year first?", a: "Kiribati's Line Islands (UTC+14) reach midnight first. Baker Island and Howland Island (UTC−12) are last, 26 hours later." }],
  },
  "new-years-eve": {
    rule: "December 31 every year",
    origin: [
      "New Year's Eve is the last day of the Gregorian year. Celebrations centre on midnight, when the old year turns into the new one, and are marked with fireworks, countdowns and toasts around the world.",
      "Because of time zones, midnight arrives at different moments. It reaches the Pacific islands first and then sweeps westwards across Auckland, Sydney, Tokyo, Dubai, London and New York, with the last celebrations in Hawaii and the far Pacific almost a day later.",
    ],
    traditions: ["Fireworks over harbours and city centres", "Counting down the final ten seconds together", "Singing Auld Lang Syne", "Dropping the ball in Times Square, New York", "Eating grapes at midnight in Spain, one for each stroke of the clock"],
    around: "It is a public holiday in few countries, but many businesses close early. In Japan it is Omisoka, when families eat toshikoshi soba and temples ring bells 108 times.",
    faq: [{ q: "What time does the new year start?", a: "At midnight local time on January 1, which for the counter on this page is the start of that day in the time zone you select." }],
  },
  thanksgiving: {
    rule: "Fourth Thursday of November (United States)",
    origin: [
      "Thanksgiving in the United States traces back to harvest feasts held by the Plymouth colonists and the Wampanoag people in 1621. Days of thanksgiving were proclaimed locally for centuries, and President Lincoln made it a national holiday in 1863.",
      "In 1941 Congress fixed the date at the fourth Thursday of November, which is why it can fall anywhere from the 22nd to the 28th.",
    ],
    traditions: ["A family dinner with roast turkey, stuffing, cranberry sauce and pumpkin pie", "The Macy's Thanksgiving Day Parade in New York", "Watching American football", "Travelling home, the busiest travel period of the year in the US", "Black Friday shopping the following day"],
    around: "Canada celebrates on the second Monday of October. Other places hold related harvest festivals, such as Germany's Erntedankfest, Liberia's Thanksgiving on the first Thursday of November and Grenada's Thanksgiving Day on October 25.",
    faq: [{ q: "Why does the date of Thanksgiving change?", a: "It is defined as the fourth Thursday of November rather than a fixed date, so it falls between November 22 and 28." }],
  },
  "black-friday": {
    rule: "The day after US Thanksgiving, the fourth Friday of November",
    origin: [
      "Black Friday is the Friday after US Thanksgiving and has been the start of the holiday shopping season since at least the 1950s. The name was first used by Philadelphia police to describe the traffic and crowds, and was later explained as the day retailers' accounts moved from red to black.",
      "Online retail has stretched the event into a week or more, with Cyber Monday following on the Monday after.",
    ],
    traditions: ["Early-morning doorbuster sales", "Online deals that begin days before", "Cyber Monday offers the following week", "Small Business Saturday on the day after"],
    around: "Black Friday sales now run in the UK, Canada, Australia, India, Brazil, much of Europe and many online stores worldwide, even where Thanksgiving is not celebrated. It is a public holiday in some US states.",
    faq: [{ q: "When is Black Friday?", a: "The day after Thanksgiving, which makes it the fourth Friday of November." }],
  },
  easter: {
    rule: "First Sunday after the first full moon on or after March 21",
    origin: [
      "Easter celebrates the resurrection of Jesus on the third day after his crucifixion and is the oldest and most important feast of the Christian year. The Council of Nicaea in 325 set the rule that ties it to the spring full moon, so that Christians would keep it on the same Sunday.",
      "Because the rule uses the lunar cycle, Western Easter can fall on any date from March 22 to April 25. Orthodox churches calculate it from the Julian calendar, so their Easter is often one to five weeks later.",
    ],
    traditions: ["Church services, including the Easter Vigil on Saturday night", "Decorating and hiding eggs and the Easter egg hunt", "The Easter bunny and chocolate eggs", "A family lunch with lamb or ham", "Holy Week processions in Spain, Italy and the Philippines"],
    around: "Good Friday and Easter Monday are public holidays in many countries, including the UK, Germany, Canada and Australia. Easter Sunday itself is a day of rest in most Christian-majority countries.",
    faq: [
      { q: "Why does Easter change every year?", a: "It is tied to the first full moon of spring, so its Gregorian date moves between March 22 and April 25." },
      { q: "When is Good Friday?", a: "Good Friday is the Friday two days before Easter Sunday, and Easter Monday is the day after." },
    ],
  },
  "mothers-day": {
    rule: "Second Sunday of May (United States, Canada and others)",
    origin: [
      "The modern Mother's Day began in the United States in the early 1900s, when Anna Jarvis campaigned to honour her mother and all mothers. Her efforts led West Virginia to hold the first state observance in 1908, and President Wilson made it a national holiday in 1914.",
      "Countries have set their own dates. Many mark it on the second Sunday of May, while the UK celebrates Mothering Sunday in March, three weeks before Easter, and others use local dates such as March 8 or May 10.",
    ],
    traditions: ["Cards, flowers and handmade gifts", "Breakfast in bed or a family brunch", "Phone calls and visits to mothers and grandmothers", "Carnations, which are the traditional flower of the day"],
    around: "The second Sunday of May is used by the US, Canada, Australia, India, Japan, Brazil and many other countries. Mexico always celebrates on May 10 and Thailand on August 12, the birthday of Queen Sirikit.",
    faq: [{ q: "Is Mother's Day on the same date worldwide?", a: "No. Dates differ by country. The page counts down to the second Sunday of May." }],
  },
  "independence-day": {
    rule: "July 4 every year (United States)",
    origin: [
      "Independence Day marks the adoption of the Declaration of Independence by the Continental Congress on July 4, 1776, which announced that the thirteen American colonies were no longer subject to British rule.",
      "Celebrations began the following year, and Congress made July 4 a federal holiday in 1870. It is now the most important patriotic holiday in the United States.",
    ],
    traditions: ["Fireworks displays and the national fireworks over the National Mall in Washington", "Parades and community picnics", "Barbecues with hot dogs, burgers and watermelon", "Flying the American flag", "Concerts including the Boston Pops on the Esplanade"],
    around: "When July 4 falls on a Saturday the federal holiday is observed on Friday, and when it falls on a Sunday it is observed on Monday. Many other countries have their own independence days on other dates.",
    faq: [{ q: "Is the 4th of July observed on a different day if it falls on a weekend?", a: "Yes. Federal offices observe it on Friday when July 4 is a Saturday, and on Monday when it is a Sunday." }],
  },
  halloween: {
    rule: "October 31 every year",
    origin: [
      "Halloween comes from the Celtic festival of Samhain, which marked the end of harvest and the start of winter, and from the Christian All Hallows' Eve, the night before All Saints' Day on November 1.",
      "Irish and Scottish immigrants brought the customs to North America in the 19th century, where they grew into the modern festival of costumes, jack-o'-lanterns and trick-or-treating.",
    ],
    traditions: ["Trick-or-treating in costume", "Carving pumpkins into jack-o'-lanterns", "Costume parties and haunted houses", "Scary stories and horror films", "Bonfires and apple games in the UK and Ireland"],
    around: "Halloween is most popular in the United States, Canada, Ireland and the UK, and its celebration has spread to Australia, Japan, Mexico and much of Europe. In Mexico the related Day of the Dead is on November 1 and 2.",
    faq: [{ q: "Why is Halloween on October 31?", a: "It is the eve of All Saints' Day on November 1, which in turn was placed near the older Celtic festival of Samhain." }],
  },
  "valentines-day": {
    rule: "February 14 every year",
    origin: [
      "Valentine's Day is named for one or more early Christian martyrs called Valentine. By the 14th century, poets such as Chaucer linked the date to courtly love, and by the 18th century lovers in England were exchanging notes and tokens.",
      "Printed cards arrived in the 19th century, and today it is a global day for romantic love, sweethearts and, increasingly, friends and family.",
    ],
    traditions: ["Cards and love notes", "Red roses and chocolates", "A romantic dinner or a weekend away", "Galentine's Day for friends on February 13", "In Japan, women give chocolate, with men returning the favour on March 14"],
    around: "It is observed in much of the world, though it is not a public holiday anywhere. In Finland it is Friends' Day, and in some countries it is also a day to celebrate friendship, not only romance.",
    faq: [{ q: "Is Valentine's Day a public holiday?", a: "No. It is a widely observed day, but it is not a public holiday in any country." }],
  },
  "lunar-new-year": {
    rule: "The second new moon after the winter solstice, between January 21 and February 20",
    origin: [
      "Lunar New Year is the most important festival in China and in many other East and Southeast Asian countries. It follows the lunisolar calendar, so it starts on a new moon, and its Gregorian date changes every year.",
      "In China it is called the Spring Festival, in Vietnam Tết and in Korea Seollal. Each year is linked to one of twelve zodiac animals and the celebrations last about two weeks, ending with the Lantern Festival.",
    ],
    traditions: ["Family reunion dinner on New Year's Eve", "Red envelopes with money given to children", "Fireworks, lion and dragon dances", "Cleaning the house before the festival and decorating with red couplets", "Dumplings in northern China, fish and rice cakes in the south"],
    around: "It is a public holiday in China, Taiwan, Hong Kong, Singapore, Malaysia, Vietnam, South Korea and Indonesia, and many other countries have large celebrations in their Chinatowns. Some governments publish the holiday dates in late autumn.",
    faq: [
      { q: "Why does Lunar New Year change every year?", a: "It follows the Moon, so the date shifts between about January 21 and February 20 on the Gregorian calendar." },
      { q: "Is it the same as Chinese New Year?", a: "Chinese New Year is the best-known name, while the festival is also celebrated under different names in Korea, Vietnam and other countries." },
    ],
  },
  diwali: {
    rule: "The new moon of the Hindu month of Kartika, usually October or November",
    origin: [
      "Diwali, the festival of lights, celebrates the victory of light over darkness and good over evil. It is observed by Hindus, Jains, Sikhs and some Buddhists, with different stories attached, such as the return of Rama to Ayodhya in the Ramayana.",
      "The main day falls on the new moon in the Hindu lunisolar month of Kartika. The festival lasts five days, with Lakshmi Puja on the main evening.",
    ],
    traditions: ["Lighting oil lamps called diyas and candles", "Drawing rangoli patterns at the door", "Fireworks and the exchange of sweets", "Prayers to Lakshmi, the goddess of wealth", "New clothes and cleaning the home"],
    around: "Diwali is a public holiday in India, Nepal, Sri Lanka, Singapore, Malaysia, Mauritius, Fiji and a few other countries, and several US states and cities have also recognised it. The exact date depends on the regional panchang.",
    faq: [{ q: "How long does Diwali last?", a: "Five days, starting with Dhanteras and ending with Bhai Dooj. The main day is the third, Lakshmi Puja." }],
  },
}

const mk = (rule: string, origin: string[], traditions: string[], around: string, faq: { q: string; a: string }[] = []): HolidayContent => ({ rule, origin, traditions, around, faq })

Object.assign(CONTENT, {
  "boxing-day": mk("December 26 every year", [
    "Boxing Day is the day after Christmas. It began in Britain, where servants and tradespeople traditionally received a gift box from their employers on the day after Christmas. It became a bank holiday in the United Kingdom in 1871.",
    "Today it is a day for sport, shopping and visiting family. Retail sales on Boxing Day are among the biggest of the year in the UK, Canada and Australia.",
  ], ["Football and rugby fixtures, and horse racing such as the King George VI Chase", "Boxing Day sales in shops and online", "Leftover Christmas dinner and visits to friends", "The Sydney to Hobart yacht race in Australia, which starts on December 26"],
  "It is a public holiday in the UK, Canada, Australia, New Zealand, South Africa and many Commonwealth countries. When December 26 falls on a weekend the holiday is moved to the following working day in most of them. In Germany and Poland the same day is Second Christmas Day.",
  [{ q: "Why is it called Boxing Day?", a: "The name most likely comes from the boxes of gifts and money given to servants and tradespeople on the day after Christmas." }]),
  "mlk-day": mk("Third Monday of January (United States)", [
    "Martin Luther King Jr. Day honours the civil rights leader born on January 15, 1929. Congress passed the holiday into law in 1983 and it was first observed nationwide in 1986. All 50 states recognised it by 2000.",
    "It is also a National Day of Service, and many Americans volunteer in their communities.",
  ], ["Marches and parades in many cities", "Volunteering as part of the National Day of Service", "School and church programmes reading from Dr. King's speeches", "Federal offices, banks and schools closed"],
  "It is a US federal holiday and falls between January 15 and 21. Some states combine it with other commemorations.",
  [{ q: "Why is the date different each year?", a: "It is set as the third Monday of January, so it moves between January 15 and 21." }]),
  "presidents-day": mk("Third Monday of February (United States)", [
    "Presidents' Day is the federal holiday officially called Washington's Birthday. It was created in 1879 to mark George Washington's birthday on February 22 and moved to the third Monday by the Uniform Monday Holiday Act in 1971.",
    "Many states and retailers treat it as a day honouring all presidents, and it is known for long weekend sales.",
  ], ["Long weekend trips", "Retail sales on mattresses, cars and furniture", "School lessons on the presidency", "Government offices, banks and schools closed"],
  "The date falls between February 15 and 21. Some states give it separate names, such as Washington's Birthday or Lincoln's Birthday.",
  [{ q: "Is Presidents' Day a federal holiday?", a: "Yes. The official federal name is Washington's Birthday." }]),
  "st-patricks-day": mk("March 17 every year", [
    "St. Patrick's Day commemorates Saint Patrick, the fifth-century missionary who is the patron saint of Ireland. March 17 is traditionally taken as the day of his death.",
    "Irish emigrants spread the celebration, and the largest parades are now held in New York, Chicago, Boston and Dublin. Chicago famously dyes its river green.",
  ], ["Wearing green and shamrocks", "Parades in Dublin, New York, Boston and Chicago", "Irish music, dancing and pub gatherings", "Corned beef and cabbage in the US"],
  "It is a public holiday in the Republic of Ireland and Northern Ireland, and in Newfoundland and Labrador and Montserrat. In the US it is widely celebrated but not a public holiday.",
  [{ q: "Is St. Patrick's Day a public holiday?", a: "In Ireland, Northern Ireland, Montserrat and the Canadian province of Newfoundland and Labrador, yes." }]),
  "good-friday": mk("The Friday before Easter Sunday", [
    "Good Friday is the Christian day that marks the crucifixion of Jesus and his death at Calvary. It falls during Holy Week, two days before Easter Sunday, and is observed with fasting, prayer and solemn services.",
    "Because Easter is tied to the Moon, Good Friday also moves each year, between March 20 and April 23.",
  ], ["Church services and the Stations of the Cross", "Fasting or eating no meat", "Hot cross buns in the UK", "Processions in Spain, Italy, Malta and the Philippines"],
  "It is a public holiday in most Western countries, including the UK, Germany, Canada and Australia. In the US it is a state holiday in some states.",
  [{ q: "How is the date of Good Friday decided?", a: "It is the Friday before Easter Sunday, which is the first Sunday after the first full moon on or after March 21." }]),
  "april-fools-day": mk("April 1 every year", [
    "April Fools' Day is an unofficial holiday of jokes and pranks. Its origin is uncertain. One theory links it to France's change of the new year from April 1 to January 1 in the 16th century, when those who forgot were mocked.",
    "Newspapers, broadcasters and brands now publish hoaxes every year, and the day is a long-standing tradition in the UK, France, Italy and the United States.",
  ], ["Playing harmless pranks on friends and family", "Fake news stories and product announcements by media and companies", "Poisson d'avril, paper fish stuck on backs in France", "Not believing anything until noon, in the UK tradition"],
  "It is not a public holiday anywhere. In the UK the tradition is that jokes should stop at noon.",
  []),
  "cinco-de-mayo": mk("May 5 every year", [
    "Cinco de Mayo commemorates the Mexican army's victory over French forces at the Battle of Puebla on May 5, 1862. It is a regional holiday in the state of Puebla and not Mexico's independence day, which is September 16.",
    "It is widely celebrated in the United States as a festival of Mexican culture, heritage and food.",
  ], ["Parades and street fairs in Puebla and across the US", "Mariachi music and folkloric dances", "Tacos, guacamole and margaritas", "Battle re-enactments in Puebla"],
  "In Mexico it is a minor observance and not a national public holiday, except in Puebla. In the US it is mostly a cultural celebration.",
  [{ q: "Is Cinco de Mayo Mexican Independence Day?", a: "No. Mexican Independence Day is September 16. Cinco de Mayo marks the Battle of Puebla in 1862." }]),
  "memorial-day": mk("Last Monday of May (United States)", [
    "Memorial Day honours the men and women who died while serving in the US armed forces. It began as Decoration Day after the Civil War, when communities decorated the graves of soldiers, and became a federal holiday observed on the last Monday of May in 1971.",
    "It is also the unofficial start of summer in the United States.",
  ], ["Visiting cemeteries and placing flags", "A national moment of remembrance at 3 p.m.", "Parades and the National Memorial Day Concert", "Barbecues, travel and the start of the summer season"],
  "It falls between May 25 and 31. Memorial Day is a US federal holiday and is separate from Veterans Day on November 11, which honours all who served.",
  [{ q: "What is the difference between Memorial Day and Veterans Day?", a: "Memorial Day remembers service members who died. Veterans Day honours all who have served in the military." }]),
  "fathers-day": mk("Third Sunday of June (United States, UK, Canada and others)", [
    "Father's Day honours fathers and father figures. The first celebration in the US was held in Spokane, Washington, in 1910, and President Nixon signed it into law as a national holiday in 1972.",
    "The date differs by country: many English-speaking countries use the third Sunday of June, while Germany marks it on Ascension Day and Australia on the first Sunday of September.",
  ], ["Cards and handmade gifts", "A family barbecue or a day outdoors", "Ties, tools and sports gear as gifts", "Phone calls and visits"],
  "The third Sunday of June is used in the US, UK, Canada, India and many others. Other countries use different dates, including March 19 in Spain and Italy.",
  [{ q: "Is Father's Day on the same date worldwide?", a: "No. This page counts down to the third Sunday of June." }]),
  juneteenth: mk("June 19 every year (United States)", [
    "Juneteenth marks June 19, 1865, when Union soldiers arrived in Galveston, Texas, and announced that enslaved people were free, more than two years after the Emancipation Proclamation.",
    "It became a US federal holiday in 2021 when President Biden signed the Juneteenth National Independence Day Act. It is the newest federal holiday.",
  ], ["Parades, concerts and community festivals", "Readings of the Emancipation Proclamation", "Family cookouts, often with red foods such as strawberry soda", "Education events about African American history"],
  "It is a federal holiday, and most US states now recognise it. When June 19 falls on a weekend the holiday is observed on the nearest weekday.",
  [{ q: "Is Juneteenth a federal holiday?", a: "Yes, since 2021." }]),
  "canada-day": mk("July 1 every year (Canada)", [
    "Canada Day marks July 1, 1867, when the British North America Act united three colonies into the Dominion of Canada. It was called Dominion Day until 1982.",
    "Celebrations include fireworks, concerts and citizenship ceremonies, with a large event on Parliament Hill in Ottawa.",
  ], ["Fireworks in cities across Canada", "Wearing red and white and flying the maple leaf flag", "Concerts and festivals, including the Ottawa show", "Citizenship ceremonies for new Canadians"],
  "It is a federal statutory holiday. When July 1 falls on a Sunday it is observed on Monday, July 2. In Newfoundland and Labrador it is also Memorial Day.",
  [{ q: "What was Canada Day called before 1982?", a: "Dominion Day." }]),
  "labor-day": mk("First Monday of September (United States)", [
    "Labor Day honours the American labor movement and the contribution of workers. It was first celebrated in New York in 1882 and made a federal holiday in 1894 after the Pullman strike.",
    "It falls on the first Monday of September and marks the unofficial end of summer in the United States.",
  ], ["Parades and picnics organised by labor unions", "Cookouts and the last summer weekend trips", "Retail sales", "The start of the school year and the football season"],
  "Most countries mark International Workers' Day on May 1, while the US and Canada celebrate in September. This page counts down to the US and Canadian date.",
  [{ q: "Why is Labor Day in September and not May 1?", a: "Government leaders in the 1890s chose the September date to separate it from the May Day events of socialist and labor movements in Europe." }]),
  "veterans-day": mk("November 11 every year (United States)", [
    "Veterans Day honours everyone who has served in the US armed forces. It falls on November 11, the anniversary of the armistice that ended the First World War in 1918, and was originally called Armistice Day.",
    "It became Veterans Day in 1954 and has been observed on November 11 each year since 1978.",
  ], ["Parades and ceremonies, including at Arlington National Cemetery", "A moment of silence at 11 a.m.", "Free meals and discounts for veterans", "Federal offices, post offices and banks closed"],
  "Many countries observe the same date as Remembrance Day or Armistice Day, including Canada, the UK, France and Australia.",
  [{ q: "Is Veterans Day always on November 11?", a: "Yes. When November 11 falls on a weekend the federal holiday is observed on the nearest weekday." }]),
  hanukkah: mk("Begins on the evening of 24 Kislev in the Hebrew calendar", [
    "Hanukkah, the Jewish festival of lights, lasts eight nights. It commemorates the rededication of the Second Temple in Jerusalem in the second century BCE, after the Maccabees' revolt, and the miracle of the oil that burned for eight days.",
    "The festival begins at sundown on the 25th day of Kislev, so the date moves each year on the Gregorian calendar and falls between late November and late December. The date here is the evening on which the first candle is lit.",
  ], ["Lighting the menorah each night with an extra candle", "Playing dreidel", "Fried foods such as latkes and sufganiyot", "Giving small gifts or chocolate coins called gelt"],
  "Hanukkah is celebrated by Jewish communities around the world and in Israel, where schools close for the week.",
  [{ q: "Does Hanukkah start the evening before?", a: "Yes. A Jewish day begins at sunset, so Hanukkah begins at sundown on the evening before the first day. The countdown runs to midnight at the start of that evening's date." }]),
  ramadan: mk("Begins at the new crescent moon of the ninth Islamic month", [
    "Ramadan is the ninth month of the Islamic calendar, in which Muslims fast from dawn to sunset. It commemorates the revelation of the Quran to the Prophet Muhammad and is a time of prayer, charity and reflection.",
    "The Islamic calendar is lunar and about 11 days shorter than the Gregorian year, so Ramadan moves earlier each year. The date shown is the expected first day; the exact day depends on the local sighting of the crescent moon and can differ by a day between countries.",
  ], ["Fasting from dawn (suhoor) to sunset (iftar)", "Special night prayers called Taraweeh", "Giving to charity (zakat and sadaqa)", "Gathering with family and friends for iftar", "Reading the Quran"],
  "Ramadan is observed by around 1.9 billion Muslims. Working hours are often shortened in Muslim-majority countries during the month, and it ends with Eid al-Fitr.",
  [{ q: "Why does Ramadan start on different days in different countries?", a: "Some countries rely on a local sighting of the new moon and others on astronomical calculation, so the start can differ by one day." }]),
  "eid-al-fitr": mk("First day of Shawwal, the month after Ramadan", [
    "Eid al-Fitr, the Festival of Breaking the Fast, marks the end of Ramadan. Muslims gather for a special morning prayer, give charity called zakat al-fitr and celebrate with family and friends.",
    "It falls on the first day of Shawwal and depends on the sighting of the crescent moon, so the date given is the expected one and may differ by a day between countries.",
  ], ["Eid prayers in mosques and open prayer grounds", "New clothes and festive meals", "Giving gifts, money and sweets to children", "Visiting relatives and friends"],
  "It is a public holiday in almost all Muslim-majority countries, usually for two to four days, and is also recognised in some other countries. It is called Seker Bayrami in Turkey and Hari Raya Aidilfitri in Malaysia and Indonesia.",
  [{ q: "Is the date of Eid certain?", a: "Not until the crescent moon is sighted. The date shown is the expected one and can vary by a day." }]),
  "eid-al-adha": mk("10 Dhu al-Hijjah, the day after the Hajj pilgrims stand at Arafat", [
    "Eid al-Adha, the Festival of Sacrifice, commemorates Ibrahim's willingness to sacrifice his son as an act of obedience to God. It comes at the end of the Hajj pilgrimage to Mecca and is the more important of the two Eids.",
    "It is celebrated on the 10th day of Dhu al-Hijjah and lasts three or four days. The date depends on the moon sighting, so the expected date may differ by a day in your country.",
  ], ["Eid prayers", "Sacrificing an animal and sharing the meat with family, neighbours and the poor", "Family gatherings and festive meals", "New clothes and gifts"],
  "It is a public holiday in most Muslim-majority countries, usually for three to five days, and is also known as Bakrid in South Asia and Kurban Bayrami in Turkey.",
  [{ q: "When does Eid al-Adha fall relative to Hajj?", a: "On the day after the day pilgrims spend at Mount Arafat, which is the 10th of Dhu al-Hijjah." }]),
})
