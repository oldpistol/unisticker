<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Models\StickerApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(DocumentType::cases());
        $extension = fake()->randomElement(['pdf', 'jpg', 'png']);
        
        return [
            'user_id' => User::factory(),
            'application_id' => StickerApplication::factory(),
            'name' => str($type->value)->slug() . '.' . $extension,
            'file_path' => 'documents/test/' . fake()->uuid() . '.' . $extension,
            'type' => $type,
            'created_at' => fake()->dateTimeBetween('-1 year'),
            'updated_at' => fake()->dateTimeBetween('-1 month'),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterMaking(function ($document) {
            // Nothing to do after making
        })->afterCreating(function ($document) {
            // Create a fake file in storage when the document is created
            Storage::fake('public');
            Storage::disk('public')->put(
                $document->file_path,
                fake()->image()
            );
        });
    }
}
