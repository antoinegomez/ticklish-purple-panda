# Stotles Backend Enginer work sample assignment

## Problem statement

All the instructions are available [here](https://www.notion.so/stotles/Backend-engineer-work-sample-assignment-15b1dd4d10d3430a8735cd3b2f12ade7).

### Summary of requirements

See the instructions (linked above) for warm-up task and full problem statement.

The core requirements are:

1. Fix the failing test so that we can correctly parse transaction amounts.
2. `fetch-transaction-data` should load all files published since 2020 from the following links:
   1. https://www.gov.uk/government/collections/spending-over-25-000
   2. https://www.gov.uk/government/collections/dft-departmental-spending-over-25000
3. A new API `/api/top_suppliers` should accept a POST request containing (optional) buyer name and time range (from/to timestamps in ISO format) and return an object containing an array supplier names & total values

   Sample request:

   ```tsx
   {
      "buyer_name": "HMRC",
      "from_date": "20210101",
      "to_date": "20210131",
   }
   ```

   or:

   ```tsx
   {
      "from_date": "20210101",
      "to_date": "20210131",
   }
   ```

   Sample response:

   ```tsx
   {
      "top_suppliers": [
         { "name": "Stotles", "total_amount": 1234567.0 }
      ]
   }
   ```

4. In the README file, please make a note of the result of the query for HMRC for all transactions in 2021.

## Code structure

The codebase is composed of:

- `load-file.main.ts` - script used to load a single CSV file from disk
- `fetch-transaction-data.main.ts` - script used to fetch data from gov.uk API
- `query-service.main.ts` - HTTP API server for querying the data

Some shared code has been extracted to other files - `db.ts` & `scraperUtils.ts` -
feel free to refactor the code more if needed.

### Libraries

The code makes use of the following libraries:

- expressjs - [documentation](https://expressjs.com/)
- knex - [documentation](https://knexjs.org/)
- luxon - [documentation](https://moment.github.io/luxon/)

## Getting started

You can run `ts-node` to execute each of these or use scripts defined in package.json:

```bash
# Starts the query service with --watch so it auto-reloads
npm run dev-query-service
# Runs the scraper
npm run dev-fetch-transaction-data
# Runs the file loader
npm run dev-load-file
```

The first time you run any script that accesses the db (calls `getDBConnection()`),
it will create db.sqlite3 file if it doesn't exist.

At any point you can delete that file and it will be recreated from scratch.

### Browsing the database

You should start by looking at the migration in `./migrations` folder.
If you prefer to browse the DB using SQL, you can use the sqlite command line (just run `sqlite3 ./db.sqlite3`)
or any other SQL client that supports sqlite.

If for any reason the database becomes unusable, you can just delete the db.sqlite3 file and it will be recreated (including running the migrations) next time you run any script.

### Disabling/Enabling TypeScript

If you prefer to completely disable TypeScript for a file, add `// @ts-nocheck` on the first line.
If you just want to disable strict type checking, modify `tsconfig.json` according to your needs.

# Candidate's notes


- Step 1: implement fetch-transaction-data script

Write concice functions to download documents and CSV.

Cache result on disk to allow re-use of data instead of spamming gov.uk website.

Call load-file script with each CSV filename to insert data in DB

TODO: Add a parameter to discard cache and force download.

- Step 2: implement load-file script

Read CSV file provided and parse data.
Use bulkInsert by batches of 500 to speed up writing.



Result of the provided top suppliers query:

- Other notes:

- Added a small helper to get DB instance.

Otherwise if using the getDBConnection() method directly it would create a new connection pool.

- Number parser to parse localized numbers

- Semaphore queue system for the fetch-data script

- Using Zod to validate inputs and unknown data to the code

```json
[
  {
    "total_amount": 35091829.309999995,
    "name": "CAPGEMINI"
  },
  {
    "total_amount": 19440760.57,
    "name": "FUJITSU SERVICES LTD"
  },
  {
    "total_amount": 12781828.55,
    "name": "MAPELEY STEPS CONTRACTOR LTD"
  },
  {
    "total_amount": 9053091.59,
    "name": "RCDTS LTD"
  },
  {
    "total_amount": 7011663.92,
    "name": "OVERBURY PLC"
  },
  {
    "total_amount": 6178223.6,
    "name": "ACCENTURE (UK) LTD"
  },
  {
    "total_amount": 4908245.5,
    "name": "KCOM GROUP PLC"
  },
  {
    "total_amount": 4220339.53,
    "name": "Buckingham Group Contracting Ltd"
  },
  {
    "total_amount": 4174687.4799999995,
    "name": "SPECIALIST COMPUTER CTR"
  },
  {
    "total_amount": 3883243.77,
    "name": "EQUAL EXPERTS UK LTD"
  },
  {
    "total_amount": 3726500.06,
    "name": "Amazon Web Services UK"
  },
  {
    "total_amount": 3722464.23,
    "name": "INTEGRATED DEBT SERVICES LTD T/AS"
  },
  {
    "total_amount": 3492369.79,
    "name": "Wincanton Group PLC"
  },
  {
    "total_amount": 3239329.93,
    "name": "VINCI CONSTRUCTION UK LTD"
  },
  {
    "total_amount": 3186939.3899999997,
    "name": "NATIONAL SAVINGS & INVESTMENTS"
  },
  {
    "total_amount": 2993826.75,
    "name": "EXCHEQUER PARTNERSHIP No2 PLC"
  },
  {
    "total_amount": 2787818.27,
    "name": "ISG Fit Out Ltd"
  },
  {
    "total_amount": 2561477.860000001,
    "name": "COMPUTACENTER (UK) LTD"
  },
  {
    "total_amount": 2551777,
    "name": "CABINET OFFICE"
  },
  {
    "total_amount": 2471238.88,
    "name": "CDW LTD"
  },
  {
    "total_amount": 2197245.12,
    "name": "Mott MacDonald"
  },
  {
    "total_amount": 2147941.55,
    "name": "Senator International Ltd"
  },
  {
    "total_amount": 2097025,
    "name": "PEOPLE SOURCE CONSULTING"
  },
  {
    "total_amount": 1997109.44,
    "name": "WATES CONSTRUCTION LTD"
  },
  {
    "total_amount": 1934875.31,
    "name": "ROYAL MAIL WHOLESALE"
  },
  {
    "total_amount": 1828587.6799999997,
    "name": "IBM UNITED KINGDOM LTD"
  },
  {
    "total_amount": 1621835.96,
    "name": "SAS SOFTWARE LTD"
  },
  {
    "total_amount": 1558069.34,
    "name": "COMMUNISIS UK LTD"
  },
  {
    "total_amount": 1482730.5,
    "name": "ERNST & YOUNG LLP"
  },
  {
    "total_amount": 1199322.8,
    "name": "FOREIGN AND COMMONWEALTH OFFICE"
  },
  {
    "total_amount": 1154823.6,
    "name": "Hitachi Vantara Ltd."
  },
  {
    "total_amount": 1075656.85,
    "name": "MERCATOR IT SOLUTIONS LTD"
  },
  {
    "total_amount": 1046137.72,
    "name": "BW INTERIORS LTD"
  },
  {
    "total_amount": 983075,
    "name": "Mastek UK Ltd"
  },
  {
    "total_amount": 875000,
    "name": "AMERICAN EXPRESS SERVICES EUROPE LTD"
  },
  {
    "total_amount": 797474.26,
    "name": "NEWCASTLE ESTATE PARTNERSHIP"
  },
  {
    "total_amount": 795075.2499999999,
    "name": "CB RICHARD ELLIS (CBRE)"
  },
  {
    "total_amount": 752250.47,
    "name": "BARCLAYS BANK PLC T/A BARCLAYCARD"
  },
  {
    "total_amount": 696975.8,
    "name": "SERVEST GROUP LTD"
  },
  {
    "total_amount": 681430.6799999999,
    "name": "TRUSTMARQUE SOLUTIONS LTD"
  },
  {
    "total_amount": 641666,
    "name": "VALUATION OFFICE AGENCY"
  },
  {
    "total_amount": 611002.8,
    "name": "MODULE AR LTD"
  },
  {
    "total_amount": 600000,
    "name": "Teville Gate House Limited"
  },
  {
    "total_amount": 585163.04,
    "name": "CHG-MERIDIAN COMPUTER"
  },
  {
    "total_amount": 583098.87,
    "name": "ESYNERGY SOLUTIONS LTD"
  },
  {
    "total_amount": 572287.5,
    "name": "ENGINE PARTNERS UK LLP"
  },
  {
    "total_amount": 525424.64,
    "name": "Inspired Energy plc"
  },
  {
    "total_amount": 453273.61,
    "name": "SODEXO LTD"
  },
  {
    "total_amount": 447876,
    "name": "BROOK STREET (UK) LTD"
  },
  {
    "total_amount": 426892.67,
    "name": "KINTO UK LIMITED"
  },
  {
    "total_amount": 411875.14,
    "name": "Royal Mail Group Ltd"
  },
  {
    "total_amount": 410987,
    "name": "BLOOM PROCUREMENT SERVICES LTD"
  },
  {
    "total_amount": 410017.14,
    "name": "OPENCAST SOFTWARE EUROPE LTD"
  },
  {
    "total_amount": 385767.88,
    "name": "BOXXE LTD"
  },
  {
    "total_amount": 368796.06,
    "name": "Cushman & Wakefield"
  },
  {
    "total_amount": 361830,
    "name": "THE INSOLVENCY SERVICE"
  },
  {
    "total_amount": 360510,
    "name": "WILLIAM ALEXANDER CONSULTING LTD"
  },
  {
    "total_amount": 356307.29,
    "name": "TRANSUNION INTERNATIONAL UK LTD"
  },
  {
    "total_amount": 353275.44,
    "name": "MMGRP LTD"
  },
  {
    "total_amount": 334248.99,
    "name": "Elliot Group Ltd"
  },
  {
    "total_amount": 322844.58,
    "name": "HS1 Limited"
  },
  {
    "total_amount": 319709,
    "name": "NUANCE COMMUNICATIONS IRELAND LTD"
  },
  {
    "total_amount": 309247.18,
    "name": "RESTORE HARROW GREEN T/AS HARROW"
  },
  {
    "total_amount": 306846.8,
    "name": "Gleeds Building Surveying Ltd"
  },
  {
    "total_amount": 306653.18,
    "name": "ATALIAN SERVEST AMK LTD"
  },
  {
    "total_amount": 298938,
    "name": "ADVENT IM LIMITED"
  },
  {
    "total_amount": 297520.02,
    "name": "SOFTCAT LTD"
  },
  {
    "total_amount": 297478.67,
    "name": "PRICEWATERHOUSECOOPERS LLP"
  },
  {
    "total_amount": 282431.51,
    "name": "EDM GROUP LTD"
  },
  {
    "total_amount": 258058.90000000002,
    "name": "BELLROCK PROPERTY & FACILITIES"
  },
  {
    "total_amount": 252550.22000000003,
    "name": "POUL SCHMITH"
  },
  {
    "total_amount": 247939.26,
    "name": "SES (Engineering Services) Ltd"
  },
  {
    "total_amount": 236322.97,
    "name": "COVENTRY CITY COUNCIL"
  },
  {
    "total_amount": 235183.74,
    "name": "HOGAN LOVELLS LLP"
  },
  {
    "total_amount": 230849.38,
    "name": "BAE SYSTEMS APPLIED INTELLIGENCE"
  },
  {
    "total_amount": 229152,
    "name": "Motis Freight Services Limited"
  },
  {
    "total_amount": 229084.18,
    "name": "IRON MOUNTAIN UK PLC"
  },
  {
    "total_amount": 227050,
    "name": "DELOITTE MCS LTD"
  },
  {
    "total_amount": 225000,
    "name": "NATIONAL RECORDS OF SCOTLAND"
  },
  {
    "total_amount": 213760,
    "name": "LEEDS CITY COUNCIL"
  },
  {
    "total_amount": 209462.5,
    "name": "Automation Logic"
  },
  {
    "total_amount": 206000,
    "name": "OFFICE FOR NATIONAL STATISTICS"
  },
  {
    "total_amount": 197343.14,
    "name": "GOVERNMENT LEGAL DEPARTMENT"
  },
  {
    "total_amount": 193223.53,
    "name": "CGI IT UK LTD"
  },
  {
    "total_amount": 186210.25,
    "name": "LINKEDIN IRELAND LTD"
  },
  {
    "total_amount": 185207,
    "name": "KNIGHT FRANK LLP"
  },
  {
    "total_amount": 180981.19999999998,
    "name": "SOUTH LANARKSHIRE COUNCIL"
  },
  {
    "total_amount": 177430.53999999998,
    "name": "Mitie Security Limited"
  },
  {
    "total_amount": 166412.11000000002,
    "name": "Jones Lang LaSalle Property Acc"
  },
  {
    "total_amount": 154045,
    "name": "PEGASYSTEMS LTD"
  },
  {
    "total_amount": 152018.78,
    "name": "MICROSOFT LTD"
  },
  {
    "total_amount": 145370.4,
    "name": "FLEXIFORM LTD"
  },
  {
    "total_amount": 142890,
    "name": "Dropbox International Unlimited"
  },
  {
    "total_amount": 137797.5,
    "name": "Crown Hosting Data Centres Ltd"
  },
  {
    "total_amount": 128470,
    "name": "CAPITA CONSULTING"
  },
  {
    "total_amount": 127346,
    "name": "IPSOS MORI UK LTD"
  },
  {
    "total_amount": 127291.84,
    "name": "GAMMA TELECOM LTD"
  },
  {
    "total_amount": 125635.86,
    "name": "POST OFFICE LTD"
  },
  {
    "total_amount": 124800,
    "name": "ENVA NORTHERN IRELAND LTD"
  },
  {
    "total_amount": 124358.37,
    "name": "BAM CONSTRUCTION LTD"
  },
  {
    "total_amount": 119032.28,
    "name": "ISS FACILITY SERVICES LTD"
  },
  {
    "total_amount": 116201.08,
    "name": "Cancom UK Ltd (Formerly OCSL)"
  },
  {
    "total_amount": 111113.7,
    "name": "JOHN GRAHAM CONSTRUCTION LTD"
  },
  {
    "total_amount": 107563.5,
    "name": "IFF RESEARCH LTD"
  },
  {
    "total_amount": 106138.18,
    "name": "MANNING GOTTLIEB OMD A DIVISION OF"
  },
  {
    "total_amount": 106043.83,
    "name": "EUROPEAN COMMISSION"
  },
  {
    "total_amount": 102675.7,
    "name": "TNT UK LTD"
  },
  {
    "total_amount": 97798.31,
    "name": "G3 WORLDWIDE (UK) LTD"
  },
  {
    "total_amount": 96000,
    "name": "EXELA TECHNOLOGIES LTD"
  },
  {
    "total_amount": 94640,
    "name": "MADE TECH LTD"
  },
  {
    "total_amount": 93852,
    "name": "LOGMEIN TECHNOLOGIES UK LTD"
  },
  {
    "total_amount": 92737,
    "name": "CITY OF EDINBURGH COUNCIL"
  },
  {
    "total_amount": 89088,
    "name": "THURROCK COUNCIL"
  },
  {
    "total_amount": 88759.71,
    "name": "Eversheds Sutherland LLP"
  },
  {
    "total_amount": 88660,
    "name": "TECKNUOVO LTD"
  },
  {
    "total_amount": 84204.5,
    "name": "TAXAID"
  },
  {
    "total_amount": 83736,
    "name": "NORTH LANARKSHIRE COUNCIL"
  },
  {
    "total_amount": 82446.78,
    "name": "VINE PROPERTY MANAGEMENT LLP"
  },
  {
    "total_amount": 82288.45,
    "name": "Manpower Direct UK Ltd"
  },
  {
    "total_amount": 79620,
    "name": "Q5 Partners LLP"
  },
  {
    "total_amount": 79425,
    "name": "BSI CYBERSECURITY AND INFORMATION"
  },
  {
    "total_amount": 79350,
    "name": "UKCLOUD LTD"
  },
  {
    "total_amount": 79140,
    "name": "FINYX CONSULTING LTD"
  },
  {
    "total_amount": 78730,
    "name": "THE SCOTLAND OFFICE"
  },
  {
    "total_amount": 76452,
    "name": "CSL - KPMG LLP"
  },
  {
    "total_amount": 75815.98,
    "name": "UK MAIL"
  },
  {
    "total_amount": 75000,
    "name": "ATELIER7 Ltd"
  },
  {
    "total_amount": 73373.01999999999,
    "name": "People Asset Management Ltd"
  },
  {
    "total_amount": 70536.37,
    "name": "AECOM LTD"
  },
  {
    "total_amount": 69660,
    "name": "GLASGOW CITY COUNCIL"
  },
  {
    "total_amount": 67521.92,
    "name": "Altius Consulting Limited"
  },
  {
    "total_amount": 67500,
    "name": "TAX VOLUNTEERS"
  },
  {
    "total_amount": 66256.68,
    "name": "Bottomline Technologies"
  },
  {
    "total_amount": 64291.2,
    "name": "TELFORD PLAZA UK LTD"
  },
  {
    "total_amount": 62051.48,
    "name": "Duradiamond Healthcare LTD"
  },
  {
    "total_amount": 59622.78,
    "name": "L & L BRAINES LIMITED"
  },
  {
    "total_amount": 56179.73,
    "name": "ENGENEUM LTD"
  },
  {
    "total_amount": 55944,
    "name": "IAN ROGERS QC"
  },
  {
    "total_amount": 53750,
    "name": "BUYINGTEAM LTD t/a Proxima"
  },
  {
    "total_amount": 52182.58,
    "name": "EOL IT SERVICES LTD"
  },
  {
    "total_amount": 50000,
    "name": "Air Berlin PLC"
  },
  {
    "total_amount": 49813.39,
    "name": "RESTORE DATASHRED LTD"
  },
  {
    "total_amount": 49066.45,
    "name": "WAGSTAFF BROS LTD"
  },
  {
    "total_amount": 46443,
    "name": "KAINOS SOFTWARE LTD"
  },
  {
    "total_amount": 43858,
    "name": "EACS LTD"
  },
  {
    "total_amount": 43585,
    "name": "BUTTERFLY PROJECTS LTD"
  },
  {
    "total_amount": 40979.79,
    "name": "ENGIE BUILDINGS LTD"
  },
  {
    "total_amount": 40565,
    "name": "LONDON BOROUGH OF NEWHAM"
  },
  {
    "total_amount": 40200,
    "name": "Sol-Tec Ltd"
  },
  {
    "total_amount": 40112.78,
    "name": "INSIGHT DIRECT (UK) LTD"
  },
  {
    "total_amount": 40000,
    "name": "DEMYS LTD"
  },
  {
    "total_amount": 38520,
    "name": "PENDRAGON"
  },
  {
    "total_amount": 37600,
    "name": "YONDER CONSULTING LTD"
  },
  {
    "total_amount": 36158,
    "name": "DUNDEE CITY COUNCIL"
  },
  {
    "total_amount": 36074.4,
    "name": "BAM TCP Atlantic Square Limited"
  },
  {
    "total_amount": 35900,
    "name": "RICHARD ATKINS QC"
  },
  {
    "total_amount": 34824,
    "name": "SOLIHULL MBC"
  },
  {
    "total_amount": 30409.669999999995,
    "name": "WYG MANAGEMENT SERVICES LTD"
  },
  {
    "total_amount": 30125.65,
    "name": "BIT ZESTY LIMITED"
  },
  {
    "total_amount": 29702.72,
    "name": "GOVERNMENT ACTUARY'S DEPARTMENT"
  },
  {
    "total_amount": 29238.89,
    "name": "FMP Global"
  },
  {
    "total_amount": 28403.69999999999,
    "name": "HP Inc"
  },
  {
    "total_amount": 27618.75,
    "name": "People for Research Ltd"
  },
  {
    "total_amount": 25838.38,
    "name": "IWFM LTD"
  },
  {
    "total_amount": 25545,
    "name": "Identity E2E"
  },
  {
    "total_amount": 25444.7,
    "name": "ADLER AND ALLAN LTD"
  },
  {
    "total_amount": 25344,
    "name": "MR RUPERT BALDRY"
  },
  {
    "total_amount": 24605,
    "name": "HORNBECK LTD T/AS LANDMARK"
  },
  {
    "total_amount": 22430.5,
    "name": "ARC Window Films Ltd"
  },
  {
    "total_amount": 21693.39,
    "name": "K INTERNATIONAL PLC"
  },
  {
    "total_amount": -38715.07000000001,
    "name": "VODAFONE"
  }
]
```
