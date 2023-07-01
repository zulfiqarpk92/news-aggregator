<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json($user);
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();

        $user->preferences = [
            'newsSources' => $request->input('newsSources'),
            'categories'  => $request->input('categories') ?: [],
            'authors'     => $request->input('authors') ?: [],
        ];
        $user->save();

        Cache::forget(md5('articles----' . $user->id)); // clear articles cache for this user

        return response()->json($user);
    }
}
