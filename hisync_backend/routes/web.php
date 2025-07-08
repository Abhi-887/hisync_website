<?php

use App\Http\Controllers\ContactInquiryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\FaqCategoryController;
use App\Http\Controllers\ResourceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Contact Inquiries Management
    Route::resource('contact-inquiries', ContactInquiryController::class)
        ->only(['index', 'show', 'update', 'destroy'])
        ->names([
            'index' => 'contact-inquiries.index',
            'show' => 'contact-inquiries.show',
            'update' => 'contact-inquiries.update',
            'destroy' => 'contact-inquiries.destroy',
        ]);

    // FAQ Categories Management
    Route::resource('faq-categories', FaqCategoryController::class);
    Route::patch('faq-categories/{faqCategory}/toggle-status', [FaqCategoryController::class, 'toggleStatus'])->name('faq-categories.toggle-status');
    Route::post('faq-categories/bulk-action', [FaqCategoryController::class, 'bulkAction'])->name('faq-categories.bulk-action');
    Route::post('faq-categories/reorder', [FaqCategoryController::class, 'reorder'])->name('faq-categories.reorder');

    // FAQ Management
    Route::resource('faqs', FaqController::class);
    Route::patch('faqs/{faq}/toggle-status', [FaqController::class, 'toggleStatus'])->name('faqs.toggle-status');
    Route::patch('faqs/{faq}/toggle-featured', [FaqController::class, 'toggleFeatured'])->name('faqs.toggle-featured');
    Route::post('faqs/bulk-action', [FaqController::class, 'bulkAction'])->name('faqs.bulk-action');

    // Resources Management
    Route::resource('resources', ResourceController::class);
    Route::post('resources/bulk-action', [ResourceController::class, 'bulkAction'])->name('resources.bulk-action');
    Route::post('resources/{resource}/seo-score', [ResourceController::class, 'generateSeoScore'])->name('resources.seo-score');
    Route::get('resources-analytics', [ResourceController::class, 'analytics'])->name('resources.analytics');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
