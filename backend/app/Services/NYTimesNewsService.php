<?php

namespace App\Services;

use App\Contracts\NewsServiceInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NYTimesNewsService extends BaseNewsService implements NewsServiceInterface
{
    private $categoryMap = [
        'business' => 'Business',
        'entertainment' => 'Movies',
        'general' => null,
        'health' => 'Health',
        'science' => 'Science',
        'sports' => 'Sports',
        'technology' => 'Technology',
        'animals-farmed' => null,
        'artanddesign' => 'Arts',
        'books' => 'Books',
        'cities' => 'New York and Region',
    ];

    public function __construct()
    {
        $this->endpoint = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
        $this->apiKeyName = 'api-key';
        $this->apiKeyValue = config('services.news_sources.ny_times');
    }

    public function params($filters)
    {
        $fq = '';
        if(! empty($filters['category'])){
            $map = $this->categoryMap;
            $categories = collect($filters['category'])->map(function($c) use ($map){
                return isset($map[$c]) ? $map[$c] : null;
            })->filter(fn($c) => $c != null)->toArray();
            $fq .= 'section_name:(' . implode($categories) . ')';
        }
        if(! empty($filters['date'])){
            $date = Carbon::parse($filters['date'])->format('Y-m-d');
            $fq .= ($fq ? ' AND ' : '') . 'pub_date:(' . $date . ')';
        }
        if(! empty($fq)){
            $this->queryParams['fq'] = $fq;
        }
        return $this;
    }

    public function normalizeArticles($data)
    {
        $articles = $data['response']['docs'] ?? [];
        return collect($articles)->map(function ($article) {
            $article = (object) $article;

            $authors = collect($article->byline['person'])->map(function($author){
                return $author['firstname'] . ' ' . ($author['middlename'] ? $author['middlename'] . ' ' : '') . $author['lastname'];
            })->join(', ');

            return [
                'id' => $article->_id,
                'title' => $article->abstract,
                'description' => $article->lead_paragraph,
                'publishedDate' => Carbon::parse($article->pub_date)->format('Y-m-d H:i:s'),
                'authors' => $authors,
                'image' => $article->multimedia ? 'https://www.nytimes.com/' . $article->multimedia[0]['url'] ?? null : null,
                'docType' => $article->document_type,
                'category' => $article->section_name,
                'source' => 'The New York Times'
            ];
        });
    }
}
