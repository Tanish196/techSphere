'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/actions/event.actions';

const CreateEvent = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for dynamic fields
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [agenda, setAgenda] = useState<string[]>([]);
  const [agendaInput, setAgendaInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddAgenda = () => {
    if (agendaInput.trim()) {
      setAgenda([...agenda, agendaInput.trim()]);
      setAgendaInput('');
    }
  };

  const handleRemoveAgenda = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  /* 
    Updated to use Server Action for better body size limit handling.
    Original fetch logic removed.
  */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Add tags and agenda as JSON strings
    formData.append('tags', JSON.stringify(tags));
    formData.append('agenda', JSON.stringify(agenda));

    try {
      // Use Server Action instead of fetch
      const result = await createEvent(formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create event');
      }

      // Redirect to the newly created event page
      if (result.event?.slug) {
        router.push(`/events/${result.event.slug}`);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="React Summit US 2025"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">
            Slug * (URL-friendly identifier)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            pattern="[a-z0-9-]+"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="react-summit-us-2025"
          />
          <p className="text-xs text-gray-500 mt-1">Use lowercase letters, numbers, and hyphens only</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={1000}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Detailed description of the event..."
          />
        </div>

        {/* Overview */}
        <div>
          <label htmlFor="overview" className="block text-sm font-medium mb-2">
            Overview *
          </label>
          <textarea
            id="overview"
            name="overview"
            required
            maxLength={500}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief overview of the event..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Event Image *
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Venue */}
        <div>
          <label htmlFor="venue" className="block text-sm font-medium mb-2">
            Venue *
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Convention Center"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="San Francisco, CA, USA"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-2">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mode */}
        <div>
          <label htmlFor="mode" className="block text-sm font-medium mb-2">
            Mode *
          </label>
          <select
            id="mode"
            name="mode"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select mode...</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label htmlFor="audience" className="block text-sm font-medium mb-2">
            Target Audience *
          </label>
          <input
            type="text"
            id="audience"
            name="audience"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Developers, Engineers, Tech Enthusiasts"
          />
        </div>

        {/* Organizer */}
        <div>
          <label htmlFor="organizer" className="block text-sm font-medium mb-2">
            Organizer *
          </label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="TechSphere Inc."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags * (At least one required)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., React, JavaScript, Frontend"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {tags.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Please add at least one tag</p>
          )}
        </div>

        {/* Agenda */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Agenda * (At least one item required)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={agendaInput}
              onChange={(e) => setAgendaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAgenda())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Opening Keynote - 9:00 AM"
            />
            <button
              type="button"
              onClick={handleAddAgenda}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
          <ul className="space-y-2">
            {agenda.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAgenda(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {agenda.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Please add at least one agenda item</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || tags.length === 0 || agenda.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateEvent;
