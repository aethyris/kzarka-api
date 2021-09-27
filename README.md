# kzarka-api

RESTful API for kzarka app implemented using Express. Uses MongoDB and mongoose to store Black Desert Online item data parsed from a Warflash's spreadsheet.

Many Pearl Shop items are not included within the database. Currently only supports the PC-NA region, so region codes do not matter.

## Usage

The API provides the following routes:

- `/<region>/marketplace/`: Returns marketplace information of all items
- `/<region>/marketplace/<item_id>`: Returns information about a single item, queried using its BDO item id
- `/<region>/imperialcooking/`: Retrieves information about items that can be transformed into imperial cooking crates. The query `cratelevel` can also be used to filter the list.