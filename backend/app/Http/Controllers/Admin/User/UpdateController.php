<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UpdateController extends Controller
{
    public function __invoke(Request $request, $id)
    {
        $user = User::with('address')->findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|array',
            'address.street_address' => 'required_with:address|string|max:255',
            'address.postcode' => 'nullable|string|max:10',
            'address.city' => 'nullable|string|max:100',
            'address.state' => 'nullable|string|max:100',
        ]);

        try {
            DB::beginTransaction();

            // Update user details
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_no' => $validated['phone'],
            ]);

            // Update or create address
            if (isset($validated['address'])) {
                if ($user->address) {
                    $user->address->update($validated['address']);
                } else {
                    $user->address()->create($validated['address']);
                }
            }

            DB::commit();

            $user->load('address');

            return response()->json([
                'message' => 'User updated successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->status,
                    'registered_at' => $user->created_at->format('n/j/Y'),
                    'address' => $user->address ? [
                        'street_address' => $user->address->street_address,
                        'postcode' => $user->address->postcode,
                        'city' => $user->address->city,
                        'state' => $user->address->state,
                    ] : null,
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
