<?php

namespace App\Services;

use App\Contracts\NewsServiceInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseNewsService implements NewsServiceInterface
{
    protected $endpoint;
    protected $apiKeyName;
    protected $apiKeyValue;
    protected $queryParams = [];

    public function getArticles()
    {
        $params = array_merge([
            $this->apiKeyName => $this->apiKeyValue
        ], $this->queryParams ?: []);

        $response = Http::get($this->endpoint, $params);

        Log::debug($response->effectiveUri());
        if($response->failed())
        {
            Log::error($response->body());
            return collect();
        }
        $data = $response->json();

        return $this->normalizeArticles($data);
    }

    protected abstract function params($filters);
    protected abstract function normalizeArticles(array $data);
}
