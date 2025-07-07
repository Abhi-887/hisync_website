<?php

use App\Http\Controllers\ContactInquiryController;
use App\Http\Controllers\FaqController;
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

    // FAQ Management
    Route::resource('faqs', FaqController::class);
    Route::patch('faqs/{faq}/toggle-status', [FaqController::class, 'toggleStatus'])->name('faqs.toggle-status');
    Route::patch('faqs/{faq}/toggle-featured', [FaqController::class, 'toggleFeatured'])->name('faqs.toggle-featured');
    Route::post('faqs/bulk-action', [FaqController::class, 'bulkAction'])->name('faqs.bulk-action');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
