# News Aggregator 

The news aggregator fetch news articles from various news data sources and display them in a pretty list. The news articles can be
filtered based on the date, category and/or news source. User can also create an account and personalize their news feed.

# Setup Guide

This guide provides step-by-step instructions on how to setup the news aggregator application.

## Prerequisites

Before you begin, make sure you have docker installed on your machine:

## Installation

Run the project using Docker and Docker-compose.

```shell
# Clone the project on your machine.
git clone git@github.com:zulfiqarpk92/news-aggregator.git

# Navigate to the project directory.
cd /path/to/news-aggregator

# Copy the env file and add NEWS Sources API keys.
cp backend/.env.example backend/.env

# Create database
touch backend/database/database.sqlite

# Update permissions
chmod -R 0775 backend/storage
chmod -R 0775 backend/bootstrap/cache

# Build docker images
docker-compose build

# Install dependencies
docker run --rm -it --volume $(pwd)/backend:/app news-aggregator-backend composer install
docker run --rm -it --volume $(pwd)/frontend:/app news-aggregator-frontend npm install

# Generate application key
docker run --rm -it --volume $(pwd)/backend:/app news-aggregator-backend php artisan key:generate

# Start the containers
docker-compose up -d
docker-compose exec backend php artisan migrate
docker-compose ps
``` 
## Get News Sources API keys
1. The Guardian: https://bonobo.capi.gutools.co.uk/register/developer
2. NewsAPI.org: https://newsapi.org/register
3. The New York Times: https://developer.nytimes.com/accounts/create
   
## Running the Project

Visit http://localhost:5173 to access News Aggregator

# Articles Caching

Caching is implemented for performance. It can be disabled from the config

```
// config/app.php
/*
 |--------------------------------------------------------------------------
 | Setting for Articles Caching
 |--------------------------------------------------------------------------
 |
 | If the setting is enabled then articles will be cached for 1 hour for every
 | unique user.
 |
 */

'articles_caching' => true,

```