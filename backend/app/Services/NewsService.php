<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class NewsService extends BaseNewsService
{
    protected $newsServices;
    protected $preferredSources = [];
    protected $filters = [];

    public function __construct(
        NYTimesNewsService $nyTimesService,
        GuardianNewsService $guardianService,
        NewsApiService $newsApiService
    ) {
        $this->newsServices = [
            'newyorktimes' => $nyTimesService,
            'theguardian' => $guardianService,
            'newsapi' => $newsApiService,
        ];
    }

    public function params($filters)
    {
        $filterDate = $filters['filterDate'] ?? '';
        $filterCategory = $filters['filterCategory'] ?? '';
        $filterSource = $filters['filterSource'] ?? '';
        $filtersApplied = $filterDate || $filterCategory || $filterSource;

        if ($filtersApplied) {
            if ($filterDate) {
                $this->filters['date'] = $filterDate;
            }
            if ($filterCategory) {
                $this->filters['category'] = [$filterCategory];
            }
            if ($filterSource) {
                $this->preferredSources[$filterSource] = true;
            }
        } else {
            $this->filters['category'] = empty($filters['categories']) ? [] : $filters['categories'];
            $this->preferredSources = empty($filters['newsSources']) ? [] : $filters['newsSources'];
        }
        return $this;
    }

    public function getArticles()
    {
        $articles = collect();

        foreach ($this->newsServices as $source => $newsService) {
            // if filter source selected, or user preference sources
            if (!empty($this->preferredSources) && empty($this->preferredSources[$source])) {
                continue;
            }
            $records = $newsService->params($this->filters)->getArticles();
            Log::info("$source: " . $records->count());
            $articles = $articles->merge($records);
        }

        return $articles;
    }

    public function normalizeArticles($data)
    {
        return [];
    }
}
