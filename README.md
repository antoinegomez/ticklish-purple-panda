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


*- Step 1:* implement fetch-transaction-data script

Write concice functions to download documents and CSV.

Cache result on disk to allow re-use of data instead of spamming gov.uk website.
Call load-file script with each CSV filename to insert data in DB

TODO: Add a parameter to discard cache and force download.

*- Step 2:* implement load-file script

Read CSV file provided and parse data.
Use bulkInsert by batches of 500 to speed up writing.

*- Step 3:* Update query-service

Add code for top_supplier endpoint.
Simple SQL query to fetch data.

Added pagination support to avoid overloading DB and api.

I did not change the result format but in an ideal world I prefer to use an enveloppe for each endpoints that are collections.


*- Other notes:*

- Added a small helper to get DB instance.

Otherwise if using the getDBConnection() method directly it would create a new connection pool.

- Number parser to parse localized numbers

- Semaphore queue system for the fetch-data script

- Using Zod to validate inputs and unknown data to the code

----

Result of the provided top suppliers query:

_(without pagination limit)_

```json
[
  {
    "total_amount": 422763798.57999974,
    "name": "CAPGEMINI"
  },
  {
    "total_amount": 359836743.16,
    "name": "FUJITSU SERVICES LTD"
  },
  {
    "total_amount": 90057695.63000001,
    "name": "RCDTS LTD"
  },
  {
    "total_amount": 87017307.66,
    "name": "MAPELEY STEPS CONTRACTOR LTD"
  },
  {
    "total_amount": 69803514.22999999,
    "name": "ACCENTURE (UK) LTD"
  },
  {
    "total_amount": 53599483.26,
    "name": "Amazon Web Services UK"
  },
  {
    "total_amount": 51448612.84,
    "name": "SPECIALIST COMPUTER CTR"
  },
  {
    "total_amount": 49867799.88000001,
    "name": "EQUAL EXPERTS UK LTD"
  },
  {
    "total_amount": 44656884.92,
    "name": "Legal & General Assurance Society"
  },
  {
    "total_amount": 43024755.550000034,
    "name": "Mitie Security Limited"
  },
  {
    "total_amount": 40543559.29,
    "name": "NATIONAL SAVINGS & INVESTMENTS"
  },
  {
    "total_amount": 39219747.239999995,
    "name": "NEWCASTLE ESTATE PARTNERSHIP"
  },
  {
    "total_amount": 38664817.76000002,
    "name": "Royal Mail Group Ltd"
  },
  {
    "total_amount": 38091983.339999996,
    "name": "COMPUTACENTER (UK) LTD"
  },
  {
    "total_amount": 36594146.24999999,
    "name": "Wincanton Group PLC"
  },
  {
    "total_amount": 36351505.71,
    "name": "SOFTCAT LTD"
  },
  {
    "total_amount": 36348163.480000004,
    "name": "CABINET OFFICE"
  },
  {
    "total_amount": 31009807.720000003,
    "name": "OVERBURY PLC"
  },
  {
    "total_amount": 29248608.080000002,
    "name": "ISG Fit Out Ltd"
  },
  {
    "total_amount": 25666905.309999995,
    "name": "SAS SOFTWARE LTD"
  },
  {
    "total_amount": 25297379,
    "name": "PEOPLE SOURCE CONSULTING"
  },
  {
    "total_amount": 25235925.16000001,
    "name": "BAM CONSTRUCTION LTD"
  },
  {
    "total_amount": 22843454.140000004,
    "name": "SODEXO LTD"
  },
  {
    "total_amount": 21989786.299999997,
    "name": "EXCHEQUER PARTNERSHIP No2 PLC"
  },
  {
    "total_amount": 20363775.459999997,
    "name": "MACE LTD"
  },
  {
    "total_amount": 19236706.14,
    "name": "INTEGRATED DEBT SERVICES LTD T/AS"
  },
  {
    "total_amount": 18659201.810000002,
    "name": "KCOM GROUP PLC"
  },
  {
    "total_amount": 18329927.61,
    "name": "PEGASYSTEMS LTD"
  },
  {
    "total_amount": 16802410.729999997,
    "name": "CDW LTD"
  },
  {
    "total_amount": 15410123.920000002,
    "name": "Legal & General Pensions Ltd"
  },
  {
    "total_amount": 14191328.909999998,
    "name": "IBM UNITED KINGDOM LTD"
  },
  {
    "total_amount": 13801020,
    "name": "Road King Ltd"
  },
  {
    "total_amount": 13553926.040000001,
    "name": "SAP (UK) LTD"
  },
  {
    "total_amount": 12712526.329999998,
    "name": "MERCATOR IT SOLUTIONS LTD"
  },
  {
    "total_amount": 12681337.220000012,
    "name": "SERVEST GROUP LTD"
  },
  {
    "total_amount": 12401822.010000004,
    "name": "Mitie Limited"
  },
  {
    "total_amount": 11918640.51,
    "name": "ERNST & YOUNG LLP"
  },
  {
    "total_amount": 11478002.54,
    "name": "COMMUNISIS UK LTD"
  },
  {
    "total_amount": 10053232.09,
    "name": "COGNIZANT"
  },
  {
    "total_amount": 9832041.780000001,
    "name": "Inspired Energy plc"
  },
  {
    "total_amount": 9792197.64,
    "name": "BARCLAYS BANK PLC T/A BARCLAYCARD"
  },
  {
    "total_amount": 9780636.040000003,
    "name": "TRUSTMARQUE SOLUTIONS LTD"
  },
  {
    "total_amount": 9730942.369999995,
    "name": "CHG-MERIDIAN COMPUTER"
  },
  {
    "total_amount": 9326748.750000002,
    "name": "GOVERNMENT PROPERTY AGENCY"
  },
  {
    "total_amount": 8645433.56,
    "name": "TECKNUOVO LTD"
  },
  {
    "total_amount": 8416533.5,
    "name": "DELOITTE LLP (L)"
  },
  {
    "total_amount": 8032570.030000002,
    "name": "SES (Engineering Services) Ltd"
  },
  {
    "total_amount": 7991091.91,
    "name": "VINCI CONSTRUCTION UK LTD"
  },
  {
    "total_amount": 7968517.71,
    "name": "Buckingham Group Contracting Ltd"
  },
  {
    "total_amount": 7764325.61,
    "name": "PRICEWATERHOUSECOOPERS LLP"
  },
  {
    "total_amount": 7652352.01,
    "name": "Mastek UK Ltd"
  },
  {
    "total_amount": 7357995.66,
    "name": "CBRE Limited"
  },
  {
    "total_amount": 7175000,
    "name": "VALUATION OFFICE AGENCY"
  },
  {
    "total_amount": 7119209.04,
    "name": "ESYNERGY SOLUTIONS LTD"
  },
  {
    "total_amount": 6942992.219999999,
    "name": "Senator International Ltd"
  },
  {
    "total_amount": 6813556.94,
    "name": "WAGSTAFF BROS LTD"
  },
  {
    "total_amount": 5804058.5,
    "name": "WILLIAM ALEXANDER CONSULTING LTD"
  },
  {
    "total_amount": 5696025.199999999,
    "name": "WATES CONSTRUCTION LTD"
  },
  {
    "total_amount": 5658465,
    "name": "NUANCE COMMUNICATIONS IRELAND LTD"
  },
  {
    "total_amount": 5629634.919999999,
    "name": "FOREIGN COMMONWEALTH & DEVELOPMENT"
  },
  {
    "total_amount": 5458784,
    "name": "DAC Beachcroft Scotland LLP"
  },
  {
    "total_amount": 5257443.76,
    "name": "Baringa Partners LLP"
  },
  {
    "total_amount": 5011465.870000002,
    "name": "BOXXE LTD"
  },
  {
    "total_amount": 4984721.550000001,
    "name": "BLOOM PROCUREMENT SERVICES LTD"
  },
  {
    "total_amount": 4980133.62,
    "name": "HIGHSPEED OFFICE LTD"
  },
  {
    "total_amount": 4895929.69,
    "name": "MICROSOFT LTD"
  },
  {
    "total_amount": 4759659.599999999,
    "name": "ATOS IT SERVICES UK LTD"
  },
  {
    "total_amount": 4680691.079999999,
    "name": "OPENCAST SOFTWARE EUROPE LTD"
  },
  {
    "total_amount": 4645605.12,
    "name": "CSL - KPMG LLP"
  },
  {
    "total_amount": 4635258.410000001,
    "name": "Department for Work and Pensions"
  },
  {
    "total_amount": 4555042.890000001,
    "name": "ROYAL MAIL WHOLESALE"
  },
  {
    "total_amount": 4493195.4799999995,
    "name": "LONDON BOROUGH OF NEWHAM"
  },
  {
    "total_amount": 4262722.11,
    "name": "TRANSUNION INTERNATIONAL UK LTD"
  },
  {
    "total_amount": 4209138.1,
    "name": "HERMAN MILLER LTD"
  },
  {
    "total_amount": 4008534.9600000004,
    "name": "HS1 Limited"
  },
  {
    "total_amount": 3962469.2,
    "name": "HOME OFFICE"
  },
  {
    "total_amount": 3775288.24,
    "name": "HM TREASURY"
  },
  {
    "total_amount": 3701645.1300000004,
    "name": "BOOTLE PFI SOLUTIONS 1998 (2) LTD"
  },
  {
    "total_amount": 3634323.5300000007,
    "name": "EDM GROUP LTD"
  },
  {
    "total_amount": 3545795.87,
    "name": "ENGINE PARTNERS UK LLP"
  },
  {
    "total_amount": 3441056.4,
    "name": "BUREAU VAN DIJK ELECTRONIC"
  },
  {
    "total_amount": 3391830.7500000005,
    "name": "JOHN GRAHAM CONSTRUCTION LTD"
  },
  {
    "total_amount": 3343200,
    "name": "COLLIERS INT PROPERTY CONSULT LTD"
  },
  {
    "total_amount": 3287062.5799999996,
    "name": "Mott MacDonald"
  },
  {
    "total_amount": 3279136.2200000007,
    "name": "CB RICHARD ELLIS (CBRE)"
  },
  {
    "total_amount": 3266308.5300000003,
    "name": "MOORHOUSE CONSULTING LIMITED"
  },
  {
    "total_amount": 3151456.8400000003,
    "name": "Astral Towers Ltd"
  },
  {
    "total_amount": 3094486.2100000004,
    "name": "ATALIAN SERVEST AMK LTD"
  },
  {
    "total_amount": 3073648.29,
    "name": "CARDIFF COUNTY COUNCIL"
  },
  {
    "total_amount": 2927232,
    "name": "Motis Freight Services Limited"
  },
  {
    "total_amount": 2925720,
    "name": "GSE Truckstop Developments Limited"
  },
  {
    "total_amount": 2903804.709999999,
    "name": "MMGRP LTD"
  },
  {
    "total_amount": 2899956.94,
    "name": "NEWCASTLE CITY COUNCIL"
  },
  {
    "total_amount": 2692454.38,
    "name": "IRON MOUNTAIN UK PLC"
  },
  {
    "total_amount": 2661022.08,
    "name": "CHANNEL PORTS LTD"
  },
  {
    "total_amount": 2659239.4499999997,
    "name": "Gleeds Building Surveying Ltd"
  },
  {
    "total_amount": 2655889.27,
    "name": "KINTO UK LIMITED"
  },
  {
    "total_amount": 2558240,
    "name": "CROYDON COUNCIL"
  },
  {
    "total_amount": 2552800.7399999998,
    "name": "INSIGHT DIRECT (UK) LTD"
  },
  {
    "total_amount": 2549677.5,
    "name": "ADVENT IM LIMITED"
  },
  {
    "total_amount": 2467534.07,
    "name": "MODULE AR LTD"
  },
  {
    "total_amount": 2330951.99,
    "name": "Phoenix Software"
  },
  {
    "total_amount": 2300590.48,
    "name": "European Electronique"
  },
  {
    "total_amount": 2234823.04,
    "name": "Colliers International"
  },
  {
    "total_amount": 2201841.81,
    "name": "SoftwareOne UK Ltd"
  },
  {
    "total_amount": 2195202.96,
    "name": "GOVERNMENT LEGAL DEPARTMENT"
  },
  {
    "total_amount": 2185920,
    "name": "GSE TRUCKSTOP DEVELOPMENTS LTD"
  },
  {
    "total_amount": 2162621,
    "name": "FINYX CONSULTING LTD"
  },
  {
    "total_amount": 2071173.16,
    "name": "RESTORE HARROW GREEN T/AS HARROW"
  },
  {
    "total_amount": 2037952.75,
    "name": "Automation Logic"
  },
  {
    "total_amount": 1991565.29,
    "name": "Jones Lang LaSalle Common Receipts"
  },
  {
    "total_amount": 1987134.7599999998,
    "name": "Bet Crown Ltd"
  },
  {
    "total_amount": 1969752.38,
    "name": "SCOTTISH WIDOWS PLC / JLL"
  },
  {
    "total_amount": 1945533,
    "name": "BW INTERIORS LTD"
  },
  {
    "total_amount": 1938600.8900000001,
    "name": "CBRE NI LTD"
  },
  {
    "total_amount": 1922642.0599999996,
    "name": "BELLROCK PROPERTY & FACILITIES"
  },
  {
    "total_amount": 1917000,
    "name": "CITY OF LONDON"
  },
  {
    "total_amount": 1913164.1099999999,
    "name": "HITACHI SOLUTIONS EUROPE LTD"
  },
  {
    "total_amount": 1879049.3,
    "name": "HP Inc"
  },
  {
    "total_amount": 1835360,
    "name": "MADE TECH LTD"
  },
  {
    "total_amount": 1790134.6700000002,
    "name": "PEVERILL SECURITIES LTD"
  },
  {
    "total_amount": 1779452.96,
    "name": "BSI CYBERSECURITY AND INFORMATION"
  },
  {
    "total_amount": 1777459.68,
    "name": "TURNER & TOWNSEND PROJECT MANAGEMEN"
  },
  {
    "total_amount": 1766725,
    "name": "Aaseya Software Services (UK) Ltd"
  },
  {
    "total_amount": 1745633.4399999995,
    "name": "Jones Lang LaSalle Property Acc"
  },
  {
    "total_amount": 1739763.1999999997,
    "name": "AECOM LTD"
  },
  {
    "total_amount": 1703301.1800000002,
    "name": "DYNATRACE LTD."
  },
  {
    "total_amount": 1694199.8599999996,
    "name": "Crown Hosting Data Centres Ltd"
  },
  {
    "total_amount": 1692225,
    "name": "Savills UK Ltd"
  },
  {
    "total_amount": 1664000,
    "name": "SALFORD CITY COUNCIL"
  },
  {
    "total_amount": 1608000,
    "name": "Mapledurham Properties Ltd"
  },
  {
    "total_amount": 1575000,
    "name": "ESRI (UK) Ltd"
  },
  {
    "total_amount": 1568550,
    "name": "McKINSEY & COMPANY"
  },
  {
    "total_amount": 1564402,
    "name": "CITY OF WESTMINSTER"
  },
  {
    "total_amount": 1561282.3399999999,
    "name": "Cushman & Wakefield"
  },
  {
    "total_amount": 1559557.8600000003,
    "name": "GAMMA TELECOM LTD"
  },
  {
    "total_amount": 1515548.6500000001,
    "name": "Smarter Technologies"
  },
  {
    "total_amount": 1496674.92,
    "name": "FOREIGN AND COMMONWEALTH OFFICE"
  },
  {
    "total_amount": 1456675,
    "name": "MANNING GOTTLIEB OMD A DIVISION OF"
  },
  {
    "total_amount": 1446114.9400000002,
    "name": "Cancom UK Ltd (Formerly OCSL)"
  },
  {
    "total_amount": 1404106.6,
    "name": "CLOUDERA INC"
  },
  {
    "total_amount": 1401840,
    "name": "GSE Truckstop Developments Ltd"
  },
  {
    "total_amount": 1392599.25,
    "name": "CGI IT UK LTD"
  },
  {
    "total_amount": 1372800,
    "name": "ENVA NORTHERN IRELAND LTD"
  },
  {
    "total_amount": 1370788.72,
    "name": "Teville Gate House Limited"
  },
  {
    "total_amount": 1350417.53,
    "name": "POUL SCHMITH"
  },
  {
    "total_amount": 1319020.8300000003,
    "name": "POST OFFICE LTD"
  },
  {
    "total_amount": 1267542.4000000001,
    "name": "SOUTH LANARKSHIRE COUNCIL"
  },
  {
    "total_amount": 1262218.4800000002,
    "name": "G3 WORLDWIDE (UK) LTD"
  },
  {
    "total_amount": 1255028.3699999999,
    "name": "UK MAIL"
  },
  {
    "total_amount": 1249280,
    "name": "NOTTINGHAM CITY COUNCIL  RESOURCES"
  },
  {
    "total_amount": 1236282.56,
    "name": "BAE SYSTEMS APPLIED INTELLIGENCE"
  },
  {
    "total_amount": 1231675.5,
    "name": "THE SCOTLAND OFFICE"
  },
  {
    "total_amount": 1202075.14,
    "name": "ECF (General Partner) Limited"
  },
  {
    "total_amount": 1193859.37,
    "name": "BIRMINGHAM INTERNATIONAL AIRPORT"
  },
  {
    "total_amount": 1187840,
    "name": "BRISTOL CITY COUNCIL"
  },
  {
    "total_amount": 1185930.92,
    "name": "EOL IT SERVICES LTD"
  },
  {
    "total_amount": 1174896,
    "name": "Q5 Partners LLP"
  },
  {
    "total_amount": 1174200,
    "name": "MOATBUILD PROPERTIES LTD"
  },
  {
    "total_amount": 1162747.8399999999,
    "name": "BYTES SOFTWARE SERVICES LTD"
  },
  {
    "total_amount": 1154823.6,
    "name": "Hitachi Vantara Ltd."
  },
  {
    "total_amount": 1099378.7600000002,
    "name": "Duradiamond Healthcare LTD"
  },
  {
    "total_amount": 1090924.59,
    "name": "Barbican Trust Ltd"
  },
  {
    "total_amount": 1085000,
    "name": "Credit Suisse c/o Slaughter & May"
  },
  {
    "total_amount": 1081454.7100000002,
    "name": "CITY OF EDINBURGH COUNCIL"
  },
  {
    "total_amount": 1029172.03,
    "name": "LAMBERT SMITH HAMPTON"
  },
  {
    "total_amount": 1027072,
    "name": "LIVERPOOL CITY COUNCIL"
  },
  {
    "total_amount": 1026217.25,
    "name": "IPSOS MORI UK LTD"
  },
  {
    "total_amount": 1016398.3,
    "name": "KAINOS SOFTWARE LTD"
  },
  {
    "total_amount": 1015677.6399999999,
    "name": "EXELA TECHNOLOGIES LTD"
  },
  {
    "total_amount": 1005456,
    "name": "NORTH LANARKSHIRE COUNCIL"
  },
  {
    "total_amount": 993124.6699999999,
    "name": "WSP UK LTD"
  },
  {
    "total_amount": 986112,
    "name": "SEFTON MBC"
  },
  {
    "total_amount": 980009.2000000001,
    "name": "GARTNER UK LTD"
  },
  {
    "total_amount": 979765,
    "name": "ATELIER7 Ltd"
  },
  {
    "total_amount": 977781,
    "name": "DELOITTE MCS LTD"
  },
  {
    "total_amount": 954880,
    "name": "LEEDS CITY COUNCIL"
  },
  {
    "total_amount": 952540,
    "name": "UKCLOUD LTD"
  },
  {
    "total_amount": 945926.4,
    "name": "Elite Cask Limited t/a Legalinx Ltd"
  },
  {
    "total_amount": 944796,
    "name": "GLASGOW CITY COUNCIL"
  },
  {
    "total_amount": 943991.6799999999,
    "name": "ORACLE CORPORATION (UK) LTD"
  },
  {
    "total_amount": 940438.9600000001,
    "name": "Finchley Land Limited"
  },
  {
    "total_amount": 934741,
    "name": "PA CONSULTING GROUP"
  },
  {
    "total_amount": 921993.7,
    "name": "PORTSMOUTH CITY COUNCIL"
  },
  {
    "total_amount": 915249,
    "name": "CAPITA CONSULTING"
  },
  {
    "total_amount": 902996.1599999999,
    "name": "IFF RESEARCH LTD"
  },
  {
    "total_amount": 900000,
    "name": "Ashfield Land (Glasgow) Ltd"
  },
  {
    "total_amount": 894798.8899999999,
    "name": "ALEXANDER MANN SOLUTIONS LTD"
  },
  {
    "total_amount": 891036.22,
    "name": "CELLEBRITE UK LTD"
  },
  {
    "total_amount": 876998.0400000002,
    "name": "People Asset Management Ltd"
  },
  {
    "total_amount": 875000,
    "name": "AMERICAN EXPRESS SERVICES EUROPE LTD"
  },
  {
    "total_amount": 867306.08,
    "name": "GOVERNMENT COMMUNICATIONS"
  },
  {
    "total_amount": 866714.7999999999,
    "name": "COCHRANE SQUARE SPV LTD"
  },
  {
    "total_amount": 851026.61,
    "name": "NATWEST- INTERNAL HMRC USE ONLY"
  },
  {
    "total_amount": 846690,
    "name": "North Highland UK Limited"
  },
  {
    "total_amount": 846600.8,
    "name": "MICRO FOCUS LTD"
  },
  {
    "total_amount": 825054.2500000001,
    "name": "FISCHER GERMAN PROPERTY MANAGEMENT"
  },
  {
    "total_amount": 822867.7,
    "name": "LAND & PROPERTY SERVICES"
  },
  {
    "total_amount": 793600,
    "name": "SUNDERLAND COUNCIL"
  },
  {
    "total_amount": 792309.15,
    "name": "WYG MANAGEMENT SERVICES LTD"
  },
  {
    "total_amount": 776847.71,
    "name": "DAC BEACHCROFT LLP - CLIENT ACCOUNT"
  },
  {
    "total_amount": 776197.27,
    "name": "BRADFORD COUNCIL"
  },
  {
    "total_amount": 774502,
    "name": "KNIGHT FRANK LLP"
  },
  {
    "total_amount": 770910,
    "name": "METHODS BUSINESS & DIGITAL"
  },
  {
    "total_amount": 763210.96,
    "name": "RR Rainbow (North) Ltd"
  },
  {
    "total_amount": 757323.3,
    "name": "Epping Forest District Council"
  },
  {
    "total_amount": 752965.94,
    "name": "SCOTTISH POLICE AUTHORITY"
  },
  {
    "total_amount": 749379.3999999999,
    "name": "Teville Gate House Ltd"
  },
  {
    "total_amount": 748543.64,
    "name": "Autumn Properties Limited"
  },
  {
    "total_amount": 747380.24,
    "name": "VMWARE UK LTD"
  },
  {
    "total_amount": 743876.87,
    "name": "INCENDIUM CONSULTING LTD"
  },
  {
    "total_amount": 727279.58,
    "name": "CA EUROPE SARL"
  },
  {
    "total_amount": 724955.09,
    "name": "DEPARTMENT FOR WORK & PENSIONS"
  },
  {
    "total_amount": 718311.9199999999,
    "name": "Bottomline Technologies"
  },
  {
    "total_amount": 718140.0800000001,
    "name": "QUALTRICS LLC"
  },
  {
    "total_amount": 703728.8799999999,
    "name": "TELFORD PLAZA UK LTD"
  },
  {
    "total_amount": 685879.64,
    "name": "Scottish Widows Plc"
  },
  {
    "total_amount": 685648.58,
    "name": "THE POLICE ICT COMPANY"
  },
  {
    "total_amount": 685464.68,
    "name": "CAPITA BUSINESS SERVICES LTD"
  },
  {
    "total_amount": 678000,
    "name": "Spirit 120 Limited"
  },
  {
    "total_amount": 671232,
    "name": "BIRMINGHAM CITY COUNCIL"
  },
  {
    "total_amount": 665679.65,
    "name": "WORTHING BOROUGH COUNCIL"
  },
  {
    "total_amount": 637831,
    "name": "RED FROG HIRE LTD"
  },
  {
    "total_amount": 625851.2999999999,
    "name": "KANTAR UK LIMITED"
  },
  {
    "total_amount": 601112.5,
    "name": "2T Security"
  },
  {
    "total_amount": 597268.38,
    "name": "BUTTERFLY PROJECTS LTD"
  },
  {
    "total_amount": 594022.5,
    "name": "MANCHESTER CITY COUNCIL"
  },
  {
    "total_amount": 590858.8799999999,
    "name": "SAVILLS COMMERCIAL LTD"
  },
  {
    "total_amount": 590000,
    "name": "GE Capital Investments & Ors"
  },
  {
    "total_amount": 571927.53,
    "name": "Automated Intelligence Ltd"
  },
  {
    "total_amount": 550000,
    "name": "West Burton Property Ltd"
  },
  {
    "total_amount": 550000,
    "name": "GB GROUP PLC"
  },
  {
    "total_amount": 536910,
    "name": "Sol-Tec Ltd"
  },
  {
    "total_amount": 536064,
    "name": "BOROUGH OF TELFORD & WREKIN"
  },
  {
    "total_amount": 520448,
    "name": "SOUTHEND BOROUGH COUNCIL"
  },
  {
    "total_amount": 514951.19999999995,
    "name": "FIVIUM LTD"
  },
  {
    "total_amount": 507540,
    "name": "NICHOLS GROUP LTD"
  },
  {
    "total_amount": 495415.9,
    "name": "FAIRPLAY ESTATES LTD"
  },
  {
    "total_amount": 483840,
    "name": "MILTON KEYNES BOROUGH COUNCIL"
  },
  {
    "total_amount": 483644.4,
    "name": "FLEXIFORM LTD"
  },
  {
    "total_amount": 480416.51,
    "name": "Poul Schmith"
  },
  {
    "total_amount": 477600,
    "name": "SOFTWARE AG (UK) LTD"
  },
  {
    "total_amount": 475410,
    "name": "FI REAL ESTATE MANAGEMENT LTD"
  },
  {
    "total_amount": 470376,
    "name": "BROOK STREET (UK) LTD"
  },
  {
    "total_amount": 450000,
    "name": "NATIONAL RECORDS OF SCOTLAND"
  },
  {
    "total_amount": 447436.89,
    "name": "WORLD CUSTOMS ORGANIZATION"
  },
  {
    "total_amount": 438872.38,
    "name": "DEPARTMENT FOR TRANSPORT (DFT)"
  },
  {
    "total_amount": 438169.37,
    "name": "EDENRED (UK GROUP) LTD (CYCLE TO WO"
  },
  {
    "total_amount": 420959,
    "name": "EUROFINS FORENSIC SERVICES LTD"
  },
  {
    "total_amount": 419878.06,
    "name": "IPSWICH BOROUGH COUNCIL"
  },
  {
    "total_amount": 414351.79,
    "name": "Elliot Group Ltd"
  },
  {
    "total_amount": 406958.34,
    "name": "ATKINS LTD"
  },
  {
    "total_amount": 403603,
    "name": "OFFICE FOR NATIONAL STATISTICS"
  },
  {
    "total_amount": 400000,
    "name": "Chartered Trading Standards"
  },
  {
    "total_amount": 391404.5,
    "name": "TAXAID"
  },
  {
    "total_amount": 373440,
    "name": "KALLIDUS LTD"
  },
  {
    "total_amount": 368044.19999999995,
    "name": "VINE PROPERTY MANAGEMENT LLP"
  },
  {
    "total_amount": 361830,
    "name": "THE INSOLVENCY SERVICE"
  },
  {
    "total_amount": 361792,
    "name": "DUNDEE CITY COUNCIL"
  },
  {
    "total_amount": 355883.23000000004,
    "name": "BAM TCP Atlantic Square Limited"
  },
  {
    "total_amount": 351107.02,
    "name": "RESTORE DATASHRED LTD"
  },
  {
    "total_amount": 350000,
    "name": "Dolphin Driling Ltd."
  },
  {
    "total_amount": 345000,
    "name": "Coinstar Ltd"
  },
  {
    "total_amount": 338224,
    "name": "CIVICA UK LTD"
  },
  {
    "total_amount": 334851.87,
    "name": "MAPELEY STEPS CONTRACTOR LTD COMPO"
  },
  {
    "total_amount": 332800,
    "name": "LEICESTER CITY COUNCIL"
  },
  {
    "total_amount": 330081.24,
    "name": "CALDER CONFERENCES LTD"
  },
  {
    "total_amount": 329476.63,
    "name": "MuleSoft LLC"
  },
  {
    "total_amount": 320841.84,
    "name": "HERO HOSPITALITY VENTURES"
  },
  {
    "total_amount": 309321,
    "name": "THE SCOTTISH GOVERNMENT"
  },
  {
    "total_amount": 307857.74,
    "name": "HOGAN LOVELLS LLP"
  },
  {
    "total_amount": 307105,
    "name": "RED HAT LTD"
  },
  {
    "total_amount": 300000,
    "name": "CREDIT SUISSE"
  },
  {
    "total_amount": 294499.94,
    "name": "OPEN TEXT UK LTD"
  },
  {
    "total_amount": 286702.5,
    "name": "Reply Limited"
  },
  {
    "total_amount": 284553.75,
    "name": "GOOD THINGS FOUNDATION"
  },
  {
    "total_amount": 279850.35,
    "name": "L & L BRAINES LIMITED"
  },
  {
    "total_amount": 279720,
    "name": "Stratford City Car Park Limited"
  },
  {
    "total_amount": 274380.96,
    "name": "SHRED STATION LTD"
  },
  {
    "total_amount": 270000,
    "name": "TAX VOLUNTEERS"
  },
  {
    "total_amount": 269100,
    "name": "CRONER-I LTD"
  },
  {
    "total_amount": 261250,
    "name": "Avolution (UK) Ltd"
  },
  {
    "total_amount": 259806.4,
    "name": "DEPARTMENT FOR EDUCATION"
  },
  {
    "total_amount": 259050,
    "name": "CREDERA LTD"
  },
  {
    "total_amount": 251280,
    "name": "LARMER BROWN LTD"
  },
  {
    "total_amount": 241751.28,
    "name": "DEPARTMENT FOR ENVIRONMENT FOOD"
  },
  {
    "total_amount": 239572.52,
    "name": "Morris and Spottiswood Limited"
  },
  {
    "total_amount": 236322.97,
    "name": "COVENTRY CITY COUNCIL"
  },
  {
    "total_amount": 234240,
    "name": "READING BOROUGH COUNCIL"
  },
  {
    "total_amount": 234000,
    "name": "SYNYEGA LTD"
  },
  {
    "total_amount": 233319.08,
    "name": "DMT SOLUTIONS UK LIMITED"
  },
  {
    "total_amount": 231049.99,
    "name": "Aganto Ltd"
  },
  {
    "total_amount": 230698.25,
    "name": "YONDER CONSULTING LTD"
  },
  {
    "total_amount": 228750,
    "name": "BUYINGTEAM LTD t/a Proxima"
  },
  {
    "total_amount": 223447.97,
    "name": "AVANADE UK LTD"
  },
  {
    "total_amount": 206526.09,
    "name": "DURHAM COUNTY COUNCIL"
  },
  {
    "total_amount": 203260.34,
    "name": "SPECIALIST COMPUTER CENTRES"
  },
  {
    "total_amount": 200655.4,
    "name": "DTZ"
  },
  {
    "total_amount": 194946.39,
    "name": "DEPT FOR INTERNATIONAL DEVELOPMENT"
  },
  {
    "total_amount": 193195.08,
    "name": "DESKPRO LTD"
  },
  {
    "total_amount": 192453.2,
    "name": "MATRIX BOOKING LTD"
  },
  {
    "total_amount": 192383.21000000002,
    "name": "Eversheds Sutherland LLP"
  },
  {
    "total_amount": 192380.03,
    "name": "MUNROE K"
  },
  {
    "total_amount": 189000,
    "name": "NewWorldTech Ltd"
  },
  {
    "total_amount": 188792.49000000002,
    "name": "People for Research Ltd"
  },
  {
    "total_amount": 188000,
    "name": "SSE PLC"
  },
  {
    "total_amount": 186210.25,
    "name": "LINKEDIN IRELAND LTD"
  },
  {
    "total_amount": 180689.02,
    "name": "CARTER ACCOMMODATION LTD"
  },
  {
    "total_amount": 180000,
    "name": "Clifford Chance LLP"
  },
  {
    "total_amount": 178200,
    "name": "GEOFF SMITH ASSOCIATES LTD"
  },
  {
    "total_amount": 176962.5,
    "name": "LEGAT OWEN"
  },
  {
    "total_amount": 174757.2,
    "name": "Granicus-Firmstep Ltd"
  },
  {
    "total_amount": 173280,
    "name": "ASIA ONLINE PTE LTD T/AS OMNISCIEN"
  },
  {
    "total_amount": 172114,
    "name": "EMI"
  },
  {
    "total_amount": 170789.10000000003,
    "name": "FMP Global"
  },
  {
    "total_amount": 169177,
    "name": "FINANCIAL TIMES LTD"
  },
  {
    "total_amount": 166967.13,
    "name": "NOMINET UK"
  },
  {
    "total_amount": 165994.56,
    "name": "Golden Lane Propeties Ltd"
  },
  {
    "total_amount": 165000,
    "name": "IBISWORLD LTD"
  },
  {
    "total_amount": 164988,
    "name": "ELENI MITROPHANOUS QC"
  },
  {
    "total_amount": 164620,
    "name": "ZYLPHA LTD"
  },
  {
    "total_amount": 163919.16,
    "name": "ENGIE BUILDINGS LTD"
  },
  {
    "total_amount": 163008.59999999998,
    "name": "SCOTTISH WIDOWS C/O JONES LANG"
  },
  {
    "total_amount": 159610.16,
    "name": "TNT UK LTD"
  },
  {
    "total_amount": 159084,
    "name": "GINGERBREAD"
  },
  {
    "total_amount": 158270,
    "name": "LONDON BOROUGH OF HILLINGDON"
  },
  {
    "total_amount": 156000,
    "name": "GENERAL REGISTER OFFICE"
  },
  {
    "total_amount": 154230,
    "name": "DAVID EWART QC"
  },
  {
    "total_amount": 152386.47,
    "name": "Balhousie Holdings Ltd. c/o Brodies"
  },
  {
    "total_amount": 150000,
    "name": "Medical Defence Union Ltd c/o Baker & MacKenzie LLP"
  },
  {
    "total_amount": 150000,
    "name": "London Gateway Port Ltd"
  },
  {
    "total_amount": 150000,
    "name": "London Clubs Managament Ltd"
  },
  {
    "total_amount": 148424.27000000002,
    "name": "EXCELPOINT LTD"
  },
  {
    "total_amount": 145099.74,
    "name": "PRESTON BOROUGH COUNCIL"
  },
  {
    "total_amount": 144163.49,
    "name": "TRUSTWAVE LTD"
  },
  {
    "total_amount": 142890,
    "name": "Dropbox International Unlimited"
  },
  {
    "total_amount": 138741,
    "name": "TMP (UK) LTD"
  },
  {
    "total_amount": 138000,
    "name": "Concentra Consulting Ltd"
  },
  {
    "total_amount": 135057.06,
    "name": "Universal Security Systems Ltd"
  },
  {
    "total_amount": 135000,
    "name": "Invamed Group C/O Field Fisher"
  },
  {
    "total_amount": 131458.40000000002,
    "name": "CARE QUALITY COMMISSION"
  },
  {
    "total_amount": 130000,
    "name": "Poundland Ltd. c/o KPMG Law"
  },
  {
    "total_amount": 129000,
    "name": "Pilkington Group Ltd"
  },
  {
    "total_amount": 128512.68,
    "name": "FCINET SECRETARIAT"
  },
  {
    "total_amount": 127065.41,
    "name": "GXO LOGISTICS SERVICES UK LIMITED"
  },
  {
    "total_amount": 125000,
    "name": "Quinn (London) Ltd. c/o Stewarts"
  },
  {
    "total_amount": 124179.87,
    "name": "ADLER AND ALLAN LTD"
  },
  {
    "total_amount": 124026.29999999999,
    "name": "RICHARD ATKINS QC"
  },
  {
    "total_amount": 123781.5,
    "name": "MONEY ADVICE TRUST"
  },
  {
    "total_amount": 121452.55,
    "name": "DEMYS LTD"
  },
  {
    "total_amount": 120306,
    "name": "BP"
  },
  {
    "total_amount": 120000,
    "name": "NatWest Group Ltd"
  },
  {
    "total_amount": 120000,
    "name": "CHAINALYSIS UK LTD"
  },
  {
    "total_amount": 119570,
    "name": "Richemont Holdings Ltd"
  },
  {
    "total_amount": 119032.28,
    "name": "ISS FACILITY SERVICES LTD"
  },
  {
    "total_amount": 118720,
    "name": "SKILLSOFT UK LTD"
  },
  {
    "total_amount": 116465.48,
    "name": "ALLSTAR BUSINESS SOLUTIONS LTD"
  },
  {
    "total_amount": 116000,
    "name": "Ebbsfleet Development Corporation"
  },
  {
    "total_amount": 114895.68,
    "name": "ONE IDENTITY SOFTWARE"
  },
  {
    "total_amount": 114000,
    "name": "Rhodia C/O Joseph Hage Aaronson"
  },
  {
    "total_amount": 113429,
    "name": "SONIC COMMUNICATIONS (INT) LTD"
  },
  {
    "total_amount": 113026.98,
    "name": "MINTEL GROUP LTD"
  },
  {
    "total_amount": 111002.04999999999,
    "name": "Manpower Direct UK Ltd"
  },
  {
    "total_amount": 110808.72,
    "name": "PITNEY BOWES FINANCE LTD (PURCH)"
  },
  {
    "total_amount": 108953.23000000001,
    "name": "Frank Knight LLP"
  },
  {
    "total_amount": 108528.81,
    "name": "PAGERDUTY"
  },
  {
    "total_amount": 106554.44,
    "name": "Landwood Group"
  },
  {
    "total_amount": 106043.83,
    "name": "EUROPEAN COMMISSION"
  },
  {
    "total_amount": 105021.02,
    "name": "Court Enforcement Services Ltd"
  },
  {
    "total_amount": 102000,
    "name": "GSPL-Unicorn Shipping"
  },
  {
    "total_amount": 101869,
    "name": "Metropolitan Police"
  },
  {
    "total_amount": 101112,
    "name": "APEX SECURITY ENGINEERING LTD"
  },
  {
    "total_amount": 100000,
    "name": "Vale Europe Ltd."
  },
  {
    "total_amount": 99341.25,
    "name": "MINISTRY OF JUSTICE"
  },
  {
    "total_amount": 97354.40000000001,
    "name": "Baillie Signs"
  },
  {
    "total_amount": 97108.5,
    "name": "QUEST SOFTWARE INTERNATIONAL LTD"
  },
  {
    "total_amount": 95771.03999999998,
    "name": "COMPASS GROUP (UK) LTD"
  },
  {
    "total_amount": 94590.81,
    "name": "SLACK TECHNOLOGIES LIMITED"
  },
  {
    "total_amount": 94207,
    "name": "Rexam"
  },
  {
    "total_amount": 93852,
    "name": "LOGMEIN TECHNOLOGIES UK LTD"
  },
  {
    "total_amount": 92978,
    "name": "DIGICERT INC"
  },
  {
    "total_amount": 92360.16,
    "name": "GRAFTON MERCHANTING GB"
  },
  {
    "total_amount": 89088,
    "name": "THURROCK COUNCIL"
  },
  {
    "total_amount": 88726.5,
    "name": "ADAMANDEVE DDB"
  },
  {
    "total_amount": 88200,
    "name": "MR MALCOLM GAMMIE QC"
  },
  {
    "total_amount": 86895.25,
    "name": "NLA MEDIA ACCESS LTD"
  },
  {
    "total_amount": 85282,
    "name": "Chubb Group Ltd"
  },
  {
    "total_amount": 85000,
    "name": "Wincanton Holdings Ltd."
  },
  {
    "total_amount": 85000,
    "name": "PINSENT MASONS SOLICITORS"
  },
  {
    "total_amount": 84480,
    "name": "Purcell Consulting Limited"
  },
  {
    "total_amount": 83250,
    "name": "XL Insurance c/o AXA XL"
  },
  {
    "total_amount": 82176,
    "name": "MR PHILIP JONES QC"
  },
  {
    "total_amount": 81900,
    "name": "Proceed Data Migration"
  },
  {
    "total_amount": 80100.17,
    "name": "HEALIX INTERNATIONAL LTD"
  },
  {
    "total_amount": 79755,
    "name": "Identity E2E"
  },
  {
    "total_amount": 78738,
    "name": "MR RUPERT BALDRY"
  },
  {
    "total_amount": 75000,
    "name": "ROOT2 TAX LTD"
  },
  {
    "total_amount": 75000,
    "name": "Colchester Institute Corporation"
  },
  {
    "total_amount": 74807.6,
    "name": "BT Mobile"
  },
  {
    "total_amount": 74160,
    "name": "BELFAST HARBOUR COMMISSIONERS"
  },
  {
    "total_amount": 72930,
    "name": "Quantexa Ltd"
  },
  {
    "total_amount": 72288,
    "name": "RUNTIME COLLECTIVE T/A BRANDWATCH"
  },
  {
    "total_amount": 72000,
    "name": "WARRINGTON BOROUGH COUNCIL"
  },
  {
    "total_amount": 71395.22,
    "name": "GOWLING WLG (UK) LLP"
  },
  {
    "total_amount": 70220.88,
    "name": "FINANCIAL REPORTING COUNCIL"
  },
  {
    "total_amount": 69035.58,
    "name": "Korn Ferry (UK) Ltd"
  },
  {
    "total_amount": 68820,
    "name": "INFORMA PLC"
  },
  {
    "total_amount": 68500,
    "name": "Centrica Overseas Holdings Ltd"
  },
  {
    "total_amount": 68435,
    "name": "COMMONWEALTH ASSOCIATION OF TAX"
  },
  {
    "total_amount": 67725,
    "name": "FIREBRAND TRAINING LTD"
  },
  {
    "total_amount": 67521.92,
    "name": "Altius Consulting Limited"
  },
  {
    "total_amount": 67432,
    "name": "Moody's Analytics UK"
  },
  {
    "total_amount": 66153.6,
    "name": "HARPERCOLLINS PUBLISHERS LTD"
  },
  {
    "total_amount": 65484,
    "name": "MR JONATHAN DAVEY"
  },
  {
    "total_amount": 65400,
    "name": "LAUNCHPAD RECRUITS LTD"
  },
  {
    "total_amount": 63768,
    "name": "LINGUISTIC LANDSCAPES"
  },
  {
    "total_amount": 62278.9,
    "name": "EDDISONS"
  },
  {
    "total_amount": 61850,
    "name": "MICHAEL GIBBON"
  },
  {
    "total_amount": 61772.69,
    "name": "CACI LTD"
  },
  {
    "total_amount": 61214.36,
    "name": "OECD"
  },
  {
    "total_amount": 58871.380000000005,
    "name": "MYCSP LTD"
  },
  {
    "total_amount": 58670,
    "name": "COPYRIGHT LICENSING AGENCY"
  },
  {
    "total_amount": 57517.72,
    "name": "WATERFRONT PROPERTY INVESTMENT LLP"
  },
  {
    "total_amount": 57356.4,
    "name": "GPA c/o CBRE"
  },
  {
    "total_amount": 56597,
    "name": "INTRALINKS INC"
  },
  {
    "total_amount": 56327,
    "name": "MELANIE HALL QC"
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
    "total_amount": 55932,
    "name": "SIDLEY AUSTIN LLP"
  },
  {
    "total_amount": 55000,
    "name": "GB Fleet Hire Limited"
  },
  {
    "total_amount": 54384,
    "name": "ECA INTERNATIONAL"
  },
  {
    "total_amount": 53857,
    "name": "The Woods Group Ltd"
  },
  {
    "total_amount": 51663.84,
    "name": "Crown Solicitors Professional Fees"
  },
  {
    "total_amount": 50000,
    "name": "Air Berlin PLC"
  },
  {
    "total_amount": 49800,
    "name": "INSTITUTE OF CUSTOMER SERVICE"
  },
  {
    "total_amount": 48000,
    "name": "TREBLE 5 TREBLE 1 LTD"
  },
  {
    "total_amount": 47778.43,
    "name": "DAC Beachcroft LLP - Office Account"
  },
  {
    "total_amount": 46838.4,
    "name": "Willis Limited"
  },
  {
    "total_amount": 46511.84,
    "name": "FCDO SERVICES"
  },
  {
    "total_amount": 45000,
    "name": "INFORMATION SERVICES GROUP"
  },
  {
    "total_amount": 44974.8,
    "name": "MS Storage Equipment Limited"
  },
  {
    "total_amount": 44833.45,
    "name": "K INTERNATIONAL PLC"
  },
  {
    "total_amount": 44694,
    "name": "INFORMATICA SOFTWARE LTD"
  },
  {
    "total_amount": 44602.88,
    "name": "FOX SYSTEMS SOFTWARE LTD"
  },
  {
    "total_amount": 44298.5,
    "name": "SIGHT AND SOUND TECHNOLOGY LTD"
  },
  {
    "total_amount": 44064,
    "name": "ELIZABETH WILSON QC"
  },
  {
    "total_amount": 43871.31,
    "name": "IOTA (INTRA-EUROPEAN ORGANISATION OF TAX ADMINISTRATIONS)"
  },
  {
    "total_amount": 43858,
    "name": "EACS LTD"
  },
  {
    "total_amount": 43740,
    "name": "LEARNING POOL LTD"
  },
  {
    "total_amount": 43725,
    "name": "OFCOM"
  },
  {
    "total_amount": 43243.35,
    "name": "THE BOC GROUP LIMITED"
  },
  {
    "total_amount": 43045.1,
    "name": "DLA PIPER"
  },
  {
    "total_amount": 42235.31,
    "name": "GOVERNMENT COMMUNICATIONS BUREAU"
  },
  {
    "total_amount": 42000,
    "name": "PROACTIVE UK LTD"
  },
  {
    "total_amount": 42000,
    "name": "Jagdev Legal"
  },
  {
    "total_amount": 42000,
    "name": "Black Rainbow Consulting Ltd"
  },
  {
    "total_amount": 41756.65,
    "name": "THE BOC GROUP LTD"
  },
  {
    "total_amount": 41700,
    "name": "Mazaru Ltd"
  },
  {
    "total_amount": 41570,
    "name": "N. T. Payne (Trustee) c/o Actons"
  },
  {
    "total_amount": 41214.89,
    "name": "XMA LTD"
  },
  {
    "total_amount": 40183.11,
    "name": "JFROG LTD"
  },
  {
    "total_amount": 40000,
    "name": "SAYARI ANALYTICS"
  },
  {
    "total_amount": 40000,
    "name": "Greenspace (UK) Ltd"
  },
  {
    "total_amount": 39546,
    "name": "BOBS BUSINESS LTD"
  },
  {
    "total_amount": 39076,
    "name": "Cognitas Global Ltd"
  },
  {
    "total_amount": 38650,
    "name": "IMA LTD"
  },
  {
    "total_amount": 38642.4,
    "name": "CLEAR REVIEW LTD"
  },
  {
    "total_amount": 38567.21,
    "name": "CPC Project Services LLP"
  },
  {
    "total_amount": 38520,
    "name": "PENDRAGON"
  },
  {
    "total_amount": 37368,
    "name": "MR MICHAEL JONES"
  },
  {
    "total_amount": 37000,
    "name": "Morrisons Solicitors LLP"
  },
  {
    "total_amount": 36680,
    "name": "Institute of Export"
  },
  {
    "total_amount": 36300,
    "name": "DAVID YATES QC"
  },
  {
    "total_amount": 36000,
    "name": "Smiths Group PLC"
  },
  {
    "total_amount": 35740.29,
    "name": "THOMSON REUTERS UK LTD"
  },
  {
    "total_amount": 35424,
    "name": "JULIAN GHOSH QC"
  },
  {
    "total_amount": 35334,
    "name": "RUSSELL REYNOLDS ASSOCIATES LTD"
  },
  {
    "total_amount": 34824,
    "name": "SOLIHULL MBC"
  },
  {
    "total_amount": 34812.49,
    "name": "Nellsar Ltd C/O Charles Russell Speechlys LLP"
  },
  {
    "total_amount": 34656,
    "name": "JOHN TALLON QC"
  },
  {
    "total_amount": 34119.61,
    "name": "British Dental Association"
  },
  {
    "total_amount": 34000,
    "name": "THE CORPORATE IT FORUM LTD"
  },
  {
    "total_amount": 33825,
    "name": "LM INFORMATION DELIVERY"
  },
  {
    "total_amount": 33400,
    "name": "SAADIAN TECHNOLOGIES UK LTD"
  },
  {
    "total_amount": 33000,
    "name": "N D & P Solicitors"
  },
  {
    "total_amount": 33000,
    "name": "LexisNexis Risk Solutions Ltd"
  },
  {
    "total_amount": 32890.1,
    "name": "BROADSTOCK OFFICE FURNITURE LTD"
  },
  {
    "total_amount": 32760.01,
    "name": "JENNY GOLDRING"
  },
  {
    "total_amount": 32740,
    "name": "Chartered Institute of"
  },
  {
    "total_amount": 32022,
    "name": "JONATHAN BREMNER QC"
  },
  {
    "total_amount": 31781.34,
    "name": "CBRE Managed Services"
  },
  {
    "total_amount": 31500,
    "name": "Fenix Media Ltd Trading"
  },
  {
    "total_amount": 31460,
    "name": "INTRASOFT INTERNATIONAL SA"
  },
  {
    "total_amount": 31067.36,
    "name": "PITNEY BOWES SOFTWARE LTD"
  },
  {
    "total_amount": 30968,
    "name": "FORENSIC SCIENCE NORTHERN IRELAND"
  },
  {
    "total_amount": 30600,
    "name": "DODS PARLIAMENTARY COMMUNICATIONS"
  },
  {
    "total_amount": 30378.36,
    "name": "A.M Best Europe-Information Services Ltd"
  },
  {
    "total_amount": 30125.65,
    "name": "BIT ZESTY LIMITED"
  },
  {
    "total_amount": 30000,
    "name": "RPB c/o JMW Solicitors"
  },
  {
    "total_amount": 30000,
    "name": "RPB C/O JMW Solicitors LLP"
  },
  {
    "total_amount": 30000,
    "name": "Kingsley Napley LLP"
  },
  {
    "total_amount": 30000,
    "name": "John Copeland & Son"
  },
  {
    "total_amount": 30000,
    "name": "Cater and Co"
  },
  {
    "total_amount": 30000,
    "name": "CCA GLOBAL LTD"
  },
  {
    "total_amount": 29901.11,
    "name": "CANFORD AUDIO PLC"
  },
  {
    "total_amount": 29702.72,
    "name": "GOVERNMENT ACTUARY'S DEPARTMENT"
  },
  {
    "total_amount": 29149.8,
    "name": "The Conygar Investment Company PLC"
  },
  {
    "total_amount": 29129.28,
    "name": "CRITICAL SIMULATIONS LTD"
  },
  {
    "total_amount": 29100,
    "name": "MARK HERBERT QC"
  },
  {
    "total_amount": 28936.8,
    "name": "PETER MANTLE"
  },
  {
    "total_amount": 28781.29,
    "name": "EE Ltd Airtime Contract"
  },
  {
    "total_amount": 28750,
    "name": "Slater Gordon Lawyers"
  },
  {
    "total_amount": 28111.7,
    "name": "Red Industries Ltd"
  },
  {
    "total_amount": 28000.8,
    "name": "ASCERTIA LTD"
  },
  {
    "total_amount": 28000,
    "name": "Wickford Development Co. Ltd"
  },
  {
    "total_amount": 27264,
    "name": "RAJENDRA DESAI"
  },
  {
    "total_amount": 27124.63,
    "name": "Silvergrow Ltd. c/o ARC Costs"
  },
  {
    "total_amount": 27100.93,
    "name": "EXETER CITY COUNCIL"
  },
  {
    "total_amount": 26900,
    "name": "BINARY VISION"
  },
  {
    "total_amount": 26568,
    "name": "OWAIN THOMAS QC"
  },
  {
    "total_amount": 26560.8,
    "name": "BEN HAYHURST"
  },
  {
    "total_amount": 26442,
    "name": "HUI LING MCCARTHY QC"
  },
  {
    "total_amount": 26000,
    "name": "FACULTY SERVICES LTD"
  },
  {
    "total_amount": 25927.63,
    "name": "THE STATIONERY OFFICE LTD"
  },
  {
    "total_amount": 25883.65,
    "name": "BANK OF ENGLAND"
  },
  {
    "total_amount": 25838.38,
    "name": "IWFM LTD"
  },
  {
    "total_amount": 25800,
    "name": "Faithful and Gould Ltd"
  },
  {
    "total_amount": 25610,
    "name": "NCFE"
  },
  {
    "total_amount": 25500,
    "name": "PHILIP BAKER QC"
  },
  {
    "total_amount": 25272,
    "name": "APARNA NATHAN QC"
  },
  {
    "total_amount": 25200,
    "name": "JAMES HENDERSON"
  },
  {
    "total_amount": 25198,
    "name": "SIMON PRITCHARD"
  },
  {
    "total_amount": 25056,
    "name": "AKASH NAWBATT QC"
  },
  {
    "total_amount": 24908.72,
    "name": "Connect Internet Solutions Ltd"
  },
  {
    "total_amount": 24750,
    "name": "ARISTI LTD"
  },
  {
    "total_amount": 24605,
    "name": "HORNBECK LTD T/AS LANDMARK"
  },
  {
    "total_amount": 23899.429999999993,
    "name": "VODAFONE"
  },
  {
    "total_amount": 22430.5,
    "name": "ARC Window Films Ltd"
  },
  {
    "total_amount": 21500,
    "name": "Train Together Ltd"
  },
  {
    "total_amount": 21389,
    "name": "BRITISH RED CROSS"
  },
  {
    "total_amount": 21207,
    "name": "RIGHT MANAGEMENT LTD"
  },
  {
    "total_amount": 0,
    "name": "RELX (UK) LTD T/A LEXISNEXIS"
  }
]
```
