<?php

use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ResourceApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API routes
Route::prefix('v1')->group(function () {
    // Contact form submission (public)
    Route::post('contact', [ContactInquiryController::class, 'store'])
        ->middleware(['throttle:5,1']); // 5 requests per minute

    // FAQ public endpoints
    Route::get('faqs', [FaqController::class, 'index'])
        ->middleware(['throttle:60,1']); // 60 requests per minute
    Route::get('faqs/{slug}', [FaqController::class, 'show'])
        ->middleware(['throttle:60,1']);
    Route::post('faqs/{slug}/helpful', [FaqController::class, 'markHelpful'])
        ->middleware(['throttle:10,1']); // 10 helpfulness votes per minute

    // Resources public endpoints
    Route::get('resources', [ResourceApiController::class, 'index'])
        ->middleware(['throttle:100,1']); // 100 requests per minute
    Route::get('resources/featured', [ResourceApiController::class, 'featured'])
        ->middleware(['throttle:60,1']);
    Route::get('resources/trending', [ResourceApiController::class, 'trending'])
        ->middleware(['throttle:60,1']);
    Route::get('resources/categories', [ResourceApiController::class, 'categories'])
        ->middleware(['throttle:30,1']);
    Route::get('resources/tags', [ResourceApiController::class, 'tags'])
        ->middleware(['throttle:30,1']);
    Route::get('resources/search', [ResourceApiController::class, 'search'])
        ->middleware(['throttle:30,1']);
    Route::get('resources/category/{category}', [ResourceApiController::class, 'byCategory'])
        ->middleware(['throttle:60,1']);
    Route::get('resources/{slug}', [ResourceApiController::class, 'show'])
        ->middleware(['throttle:100,1']);
    Route::post('resources/{slug}/share', [ResourceApiController::class, 'share'])
        ->middleware(['throttle:20,1']); // 20 share actions per minute

    // Admin routes (requires authentication)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Contact inquiries management
        Route::get('contact-inquiries', [ContactInquiryController::class, 'index']);
        Route::get('contact-inquiries/stats', [ContactInquiryController::class, 'stats']);

        // FAQ management
        Route::get('faqs/stats', [FaqController::class, 'stats']);
        Route::apiResource('faqs', FaqController::class)->except(['index', 'show']);

        // Resources management
        Route::get('resources/analytics', [ResourceApiController::class, 'analytics']);
        Route::apiResource('resources', ResourceApiController::class)->except(['index', 'show']);
    });
});
