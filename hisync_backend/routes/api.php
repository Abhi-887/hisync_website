<?php

use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\FaqController;
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

    // Admin routes (requires authentication)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Contact inquiries management
        Route::get('contact-inquiries', [ContactInquiryController::class, 'index']);
        Route::get('contact-inquiries/stats', [ContactInquiryController::class, 'stats']);

        // FAQ management
        Route::get('faqs/stats', [FaqController::class, 'stats']);
        Route::apiResource('faqs', FaqController::class)->except(['index', 'show']);
    });
});
