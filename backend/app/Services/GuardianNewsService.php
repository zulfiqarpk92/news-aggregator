<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GuardianNewsService extends BaseNewsService
{
    private $categoryMap = [
        'entertainment' => 'tv-and-radio',
        'general' => 'news',
        'health' => 'healthcare-network',
        'sports' => 'sport',
    ];

    public function __construct()
    {
        $this->endpoint = 'https://content.guardianapis.com/search';
        $this->apiKeyName = 'api-key';
        $this->apiKeyValue = config('services.news_sources.guardian');
    }

    public function params($filters)
    {
        if(! empty($filters['category'])){
            $map = $this->categoryMap;
            $categories = collect($filters['category'])->map(function($c) use ($map){
                return isset($map[$c]) ? $map[$c] : $c;
            })->filter(fn($c) => $c != null)->toArray();
            $this->queryParams['section'] = $categories[0];
        }
        if(! empty($filters['date'])){
            $date = Carbon::parse($filters['date'])->format('Y-m-d');
            $this->queryParams['from-date'] = $date;
        }
        return $this;
    }

    public function normalizeArticles($data)
    {
        $articles = $data['response']['results'] ?? [];
        return collect($articles)->map(function ($article) {
            $article = (object) $article;

            return [
                'id' => $article->id,
                'title' => $article->webTitle,
                'description' => '',
                'publishedDate' => Carbon::parse($article->webPublicationDate)->format('Y-m-d H:i:s'),
                'authors' => '',
                'image' => null,
                'docType' => $article->type,
                'category' => $article->sectionName,
                'source' => 'The Guardian'
            ];
        });
    }
}
