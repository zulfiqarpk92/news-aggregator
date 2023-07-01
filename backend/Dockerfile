FROM php:8.1-cli

# Install system dependencies
RUN apt-get update \
    && apt-get install -y \
        git \
        zip \
        unzip \
        curl \
        libpng-dev \
        libonig-dev \
        libxml2-dev \
        libzip-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#RUN docker-php-ext-install pdo mbstring

WORKDIR /app

COPY . /app

# ENV COMPOSER_ALLOW_SUPERUSER=1

# RUN composer install

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
