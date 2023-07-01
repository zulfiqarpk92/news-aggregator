<?php

namespace App\Services;

use Carbon\Carbon;

class NewsApiService extends BaseNewsService
{
    private $categoryMap = [
        'animals-farmed' => null,
        'artanddesign' => null,
        'books' => null,
        'cities' => null,
    ];

    public function __construct()
    {
        $this->endpoint = 'https://newsapi.org/v2/top-headlines';
        $this->apiKeyName = 'apiKey';
        $this->apiKeyValue = config('services.news_sources.newsapi');
        $this->queryParams = ['country' => 'us', 'pageSize' => '100'];
    }

    public function params($filters)
    {
        if(! empty($filters['category'])){
            $map = $this->categoryMap;
            $categories = collect($filters['category'])->map(function($c) use ($map){
                return isset($map[$c]) ? $map[$c] : $c;
            })->filter(fn($c) => $c != null)->toArray();
            $this->queryParams['category'] = urlencode($categories[0]);
        }
        return $this;
    }

    public function normalizeArticles($data)
    {
        $articles = $data['articles'] ?? [];
        return collect($articles)->map(function ($article, $index) {
            $article = (object) $article;

            return [
                'id' => $index+1,
                'title' => $article->title,
                'description' => $article->description ?? $article->content,
                'publishedDate' => Carbon::parse($article->publishedAt)->format('Y-m-d H:i:s'),
                'authors' => $article->author ?? '',
                'image' => $article->urlToImage,
                'docType' => '',
                'category' => '',
                'source' => 'News API'
            ];
        });
    }
}
