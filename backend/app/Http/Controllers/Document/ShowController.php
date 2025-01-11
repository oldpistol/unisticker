<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ShowController extends Controller
{
    public function __invoke(Request $request, Document $document): StreamedResponse
    {
        // Check if user has permission to view this document
        // if (!auth()->user()->is_admin && $document->user_id !== auth()->id()) {
        //     abort(403, 'Unauthorized to view this document');
        // }

        // Check if file exists
        if (!Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'Document not found');
        }

        return Storage::disk('public')->response($document->file_path);
    }
}
