
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Story API Documentation

The Story API is a RESTful API built with NestJS that provides endpoints for retrieving and managing stories. The API utilizes a `CrawlService` to handle data retrieval and processing.

## Base URL

The base URL for all API endpoints is `http://localhost:3000/api/`.

## Endpoints

### Get Suggested Story

Retrieves a suggested story.

- **URL**: `/stories/suggest`
- **Method**: GET
- **Response**: JSON object representing the suggested story.
- **Example**:

```http
GET /stories/suggest
```

### Get Detail Story

Retrieves the details of a specific story.

- **URL**: `/stories/story/:detail`
- **Method**: GET
- **Parameters**:
  - `:detail` (string): The identifier of the story.
- **Response**: JSON object representing the details of the story.
- **Example**:

```http
GET /stories/story/onepunch-man-244
```

### Get Chapter

Retrieves a specific chapter of a story.

- **URL**: `/stories/chapter/:chapter`
- **Method**: GET
- **Parameters**:
  - `:chapter` (string): The identifier of the chapter.
- **Response**: JSON object representing the chapter of the story.
- **Example**:

```http
GET /stories/chapter/onepunch-man-244-chap-237.html
```

### Search Story

Searches for stories based on a query string.

- **URL**: `/stories/search`
- **Method**: POST
- **Query Parameters**:
  - `q` (string): The search query.
- **Response**: JSON object representing the search results.
- **Example**:

```http
POST /stories/search?q=onepunch
```

### New Story

Retrieves the latest stories.

- **URL**: `/stories/new`
- **Method**: POST
- **Query Parameters**:
  - `page` (number): The page number of the results.
- **Response**: JSON object representing the latest stories.
- **Example**:

```http
POST /stories/new?page=1
```

### Get All Categories

Retrieves all available categories.

- **URL**: `/stories/categories`
- **Method**: GET
- **Response**: JSON object representing all categories.
- **Example**:

```http
GET /stories/categories
```

### Story Category

Retrieves stories based on a specific category and parameters.

- **URL**: `/stories/category/:category/:param`
- **Method**: POST
- **Parameters**:
  - `:category` (string): The category of the stories.
  - `:param` (string): Additional parameter for the category.
- **Query Parameters**:
  - `sheet` (number): The sheet number.
  - `status` (number): The status of the stories. (0 or 2)
    - 0: In process
    - 2: Complete
  - `country` (number): The country of the stories. (1 to 5)
    - 1: China
    - 2: Vietnam
    - 3: Korea
    - 4: Japan
    - 5: US
  - `sort` (number): The sorting order. (0 to 5)
    - 0: posting date descending
    - 1: Posting date is increasing
    - 2: Descending update date
    - 3: Incremental update date
    - 4: Views are decreasing
    - 5: Views are increasing
- **Response**: JSON object representing the stories based on the category and parameters.
- **Example**:

```http
POST /stories/category/action-26/trang-1.html?sheet=1&status=1&country=1&sort=1
```

### Author Story

Retrieves stories written by a specific author.

- **URL**: `/stories/author/:author`
- **Method**: GET
- **Parameters**:
  - `:author` (string): The name of the author.
- **Response**: JSON object representing the stories written by the author.
- **Example**:

```http
GET /stories/author/eiichiro-oda-129.html
```

Nest is [MIT licensed](LICENSE).
