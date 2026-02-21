'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/actions/event.actions';

const CreateEvent = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for dynamic fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [agenda, setAgenda] = useState<string[]>([]);
  const [agendaInput, setAgendaInput] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
    };

    if (title) {
      setSlug(generateSlug(title));
    }
  }, [title]);

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
    <section className="max-w-4xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-gradient text-5xl font-bold max-sm:text-3xl mb-3">
          Create New Event
        </h1>
        <p className="text-light-100 text-lg max-sm:text-base">
          Fill in the details below to create your tech event
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} id="create-event-form" className="space-y-6">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="React Summit US 2025"
          />
        </div>

        {/* Slug - Auto-generated, read-only */}
        <div className="form-group">
          <label htmlFor="slug" className="form-label">
            Event Slug * (Auto-generated from title)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            readOnly
            value={slug}
            className="form-input bg-dark-100 cursor-not-allowed"
            placeholder="Slug will be generated automatically"
          />
          <p className="text-xs text-light-200 mt-1">This will be used in the URL: /events/{slug || 'your-event-slug'}</p>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={1000}
            rows={4}
            className="form-input resize-none"
            placeholder="Detailed description of the event..."
          />
        </div>

        {/* Overview */}
        <div className="form-group">
          <label htmlFor="overview" className="form-label">
            Overview *
          </label>
          <textarea
            id="overview"
            name="overview"
            required
            maxLength={500}
            rows={3}
            className="form-input resize-none"
            placeholder="Brief overview of the event..."
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Event Image * (Max 10MB)
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/90 file:cursor-pointer"
          />
        </div>

        {/* Venue and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="venue" className="form-label">
              Venue *
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              required
              className="form-input"
              placeholder="Convention Center"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="form-input"
              placeholder="San Francisco, CA, USA"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="time" className="form-label">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Mode */}
        <div className="form-group">
          <label htmlFor="mode" className="form-label">
            Event Mode *
          </label>
          <select
            id="mode"
            name="mode"
            required
            className="form-input cursor-pointer"
          >
            <option value="">Select event mode...</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Audience and Organizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="audience" className="form-label">
              Target Audience *
            </label>
            <input
              type="text"
              id="audience"
              name="audience"
              required
              className="form-input"
              placeholder="Developers, Engineers, Tech Enthusiasts"
            />
          </div>

          <div className="form-group">
            <label htmlFor="organizer" className="form-label">
              Organizer *
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              required
              className="form-input"
              placeholder="TechSphere Inc."
            />
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">
            Tags * (At least one required)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="form-input flex-1"
              placeholder="e.g., React, JavaScript, Frontend"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-2.5 bg-primary text-black font-semibold rounded-[6px] hover:bg-primary/90 transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="pill flex items-center gap-2 bg-dark-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-red-400 hover:text-red-300 text-lg leading-none"
                  aria-label="Remove tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {tags.length === 0 && (
            <p className="text-xs text-red-400 mt-2">Please add at least one tag</p>
          )}
        </div>

        {/* Agenda */}
        <div className="form-group">
          <label className="form-label">
            Event Agenda * (At least one item required)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={agendaInput}
              onChange={(e) => setAgendaInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAgenda())}
              className="form-input flex-1"
              placeholder="e.g., Opening Keynote - 9:00 AM"
            />
            <button
              type="button"
              onClick={handleAddAgenda}
              className="px-6 py-2.5 bg-primary text-black font-semibold rounded-[6px] hover:bg-primary/90 transition-all"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {agenda.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-dark-200 rounded-[6px] border border-dark-200"
              >
                <span className="text-sm text-light-100">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAgenda(index)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {agenda.length === 0 && (
            <p className="text-xs text-red-400 mt-2">Please add at least one agenda item</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || tags.length === 0 || agenda.length === 0}
            className="flex-1 px-6 py-3.5 bg-primary text-black font-semibold rounded-[6px] hover:bg-primary/90 disabled:bg-dark-200 disabled:text-light-200 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                Creating Event...
              </span>
            ) : (
              'Create Event'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3.5 bg-dark-100 border border-dark-200 text-white font-semibold rounded-[6px] hover:border-primary/50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateEvent;
