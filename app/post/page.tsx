 'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { supabase } from '../../lib/supabaseClient';
import {
  CATEGORY_CONFIG,
  ETHIOPIA_REGIONS,
  CONDITIONS,
} from '../../lib/categories';
import { listingSlug } from '../../lib/listings';
import { compressImage } from '../../lib/compressImage';

const MAX_PHOTOS = 5;

const inputClass =
  'w-full rounded-bazaa border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-mutedLight transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20';

const labelClass = 'mb-1.5 block text-sm font-semibold text-ink';

export default function PostPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [region, setRegion] = useState(ETHIOPIA_REGIONS[0]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);

      if (data.user?.email) {
        setEmail(data.user.email);
      }

      setReady(true);
    });
  }, []);

  const subcategories = Object.keys(
    CATEGORY_CONFIG[category]?.subcategories ?? {}
  );

  const brands = subcategory
    ? CATEGORY_CONFIG[category]?.subcategories[subcategory] ?? []
    : [];

  function onCategoryChange(value: string) {
    setCategory(value);
    setSubcategory('');
    setBrand('');
  }

  function onSubcategoryChange(value: string) {
    setSubcategory(value);
    setBrand('');
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);

    if (picked.length > MAX_PHOTOS) {
      setError(
        `You can add up to ${MAX_PHOTOS} photos. The first ${MAX_PHOTOS} will be used.`
      );
    } else {
      setError('');
    }

    setFiles(picked.slice(0, MAX_PHOTOS));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;

    if (files.length === 0) {
      setError('Please add at least one photo.');
      return;
    }

    setBusy(true);
    setError('');

    const imageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setStatus(`Uploading photo ${i + 1} of ${files.length}...`);

      const file = await compressImage(files[i]);
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);

      if (uploadError) {
        setError(`Could not upload photo ${i + 1}: ${uploadError.message}`);
        setBusy(false);
        setStatus('');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      imageUrls.push(urlData.publicUrl);
    }

    setStatus('Publishing...');

    const { data, error: insertError } = await supabase
      .from('listings')
      .insert({
        title: title.trim(),
        price: Number(price),
        category,
        subcategory: subcategory || null,
        brand: brand || null,
        condition,
        region,
        location: location.trim(),
        description: description.trim(),
        email: email.trim(),
        phone: phone.trim(),
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        user_id: user.id,
      })
      .select('id, title')
      .single();

    if (insertError || !data) {
      setError(
        insertError?.message ??
          'Something went wrong saving your listing.'
      );
      setBusy(false);
      setStatus('');
      return;
    }

    router.push(`/products/${listingSlug(data)}`);
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <div className="bazaa-card p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amberSoft text-amberDeep">
            <span className="text-xl">+</span>
          </div>

          <h1 className="bazaa-title text-2xl">
            Log in to post a listing
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Use the Log in / Sign up button at the top of the page,
            then come back here.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-bazaa bg-amber px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-amberDeep"
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-2 sm:py-4">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-amberDeep">
          Sell on Bazaa
        </p>

        <h1 className="bazaa-title mt-1 text-3xl sm:text-4xl">
          Post a listing
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          Add the details below to create your marketplace listing.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <section className="bazaa-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-serif text-xl font-bold text-ink">
              Photos
            </h2>
            <p className="mt-1 text-sm text-muted">
              Add up to {MAX_PHOTOS} clear photos. The first photo will be
              used as the main listing image.
            </p>
          </div>

          <label
            htmlFor="listing-photos"
            className="flex cursor-pointer flex-col items-center justify-center rounded-bazaa border border-dashed border-line bg-paper px-5 py-8 text-center transition-colors hover:border-amber hover:bg-amberSoft"
          >
            <span className="mb-2 text-2xl text-amberDeep">+</span>
            <span className="font-semibold text-ink">
              Choose photos
            </span>
            <span className="mt-1 text-xs text-muted">
              JPG, PNG or other image formats
            </span>

            <input
              id="listing-photos"
              type="file"
              accept="image/*"
              multiple
              onChange={onFilesChange}
              className="sr-only"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-3 rounded-bazaa bg-amberSoft px-4 py-3 text-sm text-ink">
              <span className="font-semibold">
                {files.length} photo{files.length === 1 ? '' : 's'}
              </span>{' '}
              selected
            </div>
          )}
        </section>

        <section className="bazaa-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-serif text-xl font-bold text-ink">
              Basic details
            </h2>
            <p className="mt-1 text-sm text-muted">
              Tell buyers what you're selling.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone 13 Pro, 128GB"
              />
            </div>

            <div>
              <label className={labelClass}>Price (ETB)</label>
              <input
                className={inputClass}
                type="number"
                inputMode="numeric"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 45000"
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                {Object.keys(CATEGORY_CONFIG).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {subcategories.length > 0 && (
              <div>
                <label className={labelClass}>Subcategory</label>
                <select
                  className={inputClass}
                  required
                  value={subcategory}
                  onChange={(e) => onSubcategoryChange(e.target.value)}
                >
                  <option value="">Select...</option>

                  {subcategories.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {brands.length > 0 && (
              <div>
                <label className={labelClass}>Brand</label>
                <select
                  className={inputClass}
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Select...</option>

                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={labelClass}>Condition</label>
              <select
                className={inputClass}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bazaa-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-serif text-xl font-bold text-ink">
              Location
            </h2>
            <p className="mt-1 text-sm text-muted">
              Help nearby buyers find your listing.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Region</label>
              <select
                className={inputClass}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {ETHIOPIA_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Location (city/area)
              </label>
              <input
                className={inputClass}
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jigjiga, Bole"
              />
            </div>
          </div>
        </section>

        <section className="bazaa-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-serif text-xl font-bold text-ink">
              Description
            </h2>
            <p className="mt-1 text-sm text-muted">
              Give buyers the important details about the item.
            </p>
          </div>

          <textarea
            className={`${inputClass} resize-y`}
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition, details, why you're selling..."
          />
        </section>

        <section className="bazaa-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-serif text-xl font-bold text-ink">
              Contact details
            </h2>
            <p className="mt-1 text-sm text-muted">
              Buyers will use these details to contact you.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Phone number</label>
              <input
                className={inputClass}
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0911 234 567"
              />
            </div>

            <div>
              <label className={labelClass}>Contact email</label>
              <input
                className={inputClass}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-bazaa border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {busy && status && (
          <div className="rounded-bazaa border border-line bg-white p-4 text-sm text-muted">
            {status}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="bazaa-primary w-full py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? status || 'Working...' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
               }
