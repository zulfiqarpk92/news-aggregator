<?php

namespace App\Http\Controllers;

use App\Services\NewsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function index(Request $request)
    {
        $user = Auth::guard('sanctum')->user();

        $prefs = $user?->preferences ?? [];

        $uniqueId = $user?->id ?? $request->ip();

        $filters = $request->input('filters') ?: [];

        $filterText = $filters['filterText'] ?? '';
        $filterDate = $filters['filterDate'] ?? '';
        $filterCategory = $filters['filterCategory'] ?? '';
        $filterSource = $filters['filterSource'] ?? '';
        $filtersApplied = $filterText || $filterDate || $filterCategory || $filterSource;

        if($filterDate){
            $filterDate = Carbon::parse($filterDate)->format('Y-m-d');
        }

        $articles = [];

        // Concatenate the filter values
        $filterString = $filterText . '-' . $filterDate . '-' . $filterCategory . '-' . $filterSource;

        // Generate a hash from the filter string
        $cacheKey = md5('articles-' . $filterString . '-' . $uniqueId);

        // Cache results for performance
        if (config('app.articles_caching') && Cache::has($cacheKey)) {
            $articles = Cache::get($cacheKey);
            $articles = json_decode($articles);
            Log::info('Cached result returned');
        }
        else {
            // Retrieve articles from the news service
            $articles = $this->newsService->params($filtersApplied ? $filters : $prefs)->getArticles();
            if(config('app.articles_caching')){
                Cache::put($cacheKey, json_encode($articles), 3600); // put in cache for 1 hour
            }
        }

        return response()->json(['articles' => $articles, 'filters' => $filters, 'prefs' => $prefs, 'ck' => 'articles-' . $filterString . '-' . $uniqueId]);
    }
}
