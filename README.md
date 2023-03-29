# Commercial-Nordpool-integration

Requirement:

- SUPER URGENT (Kraftringen wants it like yesterday) but TEMPORARY solution to keep KraftRingen moving on with their project:
    - Implement an Yggio external function residing on service host that via Yggio API reads the current Nordpool device time series data on https://staging.yggio.net "Nordpool - SE4 (SEK)" account stagetest with pwd stagetest every hour at XX:01 and get the current price.
    - The Nordpool - SE4 (SEK) updates once per day with next 24 hours official price.
    - Once function have the current price it should get written with HTTP or MQTT a Nordpool-Temp generic node in KraftRingen server.
