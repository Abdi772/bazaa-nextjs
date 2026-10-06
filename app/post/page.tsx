 'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { modelsFor } from '../../lib/models';
import { cleanSpecs, DEFAULT_PHONE_SPECS, hasSpecs, type SpecRow } from '../../lib/specs';
import SpecsEditor from '../SpecsEditor';
import { supabase } from '../../lib/supabaseClient';
import { CATEGORY_CONFIG, ETHIOPIA_REGIONS, CONDITIONS } from '../../lib/categories';
import { listingSlug } from '../../lib/listings';
import { compressImage } from '../../lib/compressImage';

const MAX_PHOTOS = 5;

const inputClass =
  'w-full min-h-[48px] rounded-bazaa border-[1.5px] border-line bg-white px-4 py-3 text-base text-ink placeholder:text-mutedLight transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20';
const labelClass = 'mb-1.5 block text-sm font-bold text-ink';
const rowClass =
  'flex w-full min-h-[56px] items-center justify-between border-b border-line px-4 py-3 text-left text-base text-ink active:bg-amberSoft';

// Every answer controls the next screen.
type StepId =
  | 'category'
  | 'subcategory'
  | 'brand'
  | 'model'
  | 'photos'
  | 'details'
  | 'basics'
  | 'location'
  | 'contact'
  | 'preview';

const STEP_TITLES: Record<StepId, string> = {
  category: 'What type of item is it?',
  subcategory: 'What kind of item?',
  brand: 'Which brand?',
  model: 'Which model?',
  photos: 'Show your item',
  details: 'Item details',
  basics: 'Title, price and description',
  location: 'Where is the item located?',
  contact: 'How can buyers reach you?',
  preview: 'Preview your ad',
};

// Builds the list of screens for the current answers.
function stepsFor(category: string, subcategory: string, brand: string): StepId[] {
  const subs = Object.keys(CATEGORY_CONFIG[category]?.subcategories ?? {});
  const brands = subcategory ? CATEGORY_CONFIG[category]?.subcategories[subcategory] ?? [] : [];
  const steps: StepId[] = ['category'];
  if (subs.length > 0) steps.push('subcategory');
  if (subcategory && brands.length > 0) steps.push('brand');
  if (subcategory && brand && modelsFor(subcategory, brand).length > 0) steps.push('model');
  steps.push('photos', 'details', 'basics', 'location', 'contact', 'preview');
  return steps;
}

export default function PostPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const [step, setStep] = useState<StepId>('category');

  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [region, setRegion] = useState(ETHIOPIA_REGIONS[0]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [specs, setSpecs] = useState<SpecRow[]>(DEFAULT_PHONE_SPECS);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [published, setPublished] = useState<{ id: number; title: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user?.email) setEmail(data.user.email);
      setReady(true);
    });
  }, []);

  // Small previews of the chosen photos
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const steps = stepsFor(category, subcategory, brand);
  const index = Math.max(0, steps.indexOf(step));
  const subcategories = Object.keys(CATEGORY_CONFIG[category]?.subcategories ?? {});
  const brands = subcategory ? CATEGORY_CONFIG[category]?.subcategories[subcategory] ?? [] : [];
  const modelList = subcategory && brand ? modelsFor(subcategory, brand) : [];

  function go(id: StepId) {
    setError('');
    setStep(id);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  function goBack() {
    if (index > 0) go(steps[index - 1]);
    else router.push('/');
  }

  // Go to the screen after `from`, using the answers just chosen
  function goAfter(from: StepId, cat: string, sub: string, br: string) {
    const next = stepsFor(cat, sub, br);
    go(next[next.indexOf(from) + 1]);
  }

  function pickCategory(value: string) {
    setCategory(value);
    setSubcategory('');
    setBrand('');
    setModel('');
    goAfter('category', value, '', '');
  }

  function pickSubcategory(value: string) {
    setSubcategory(value);
    setBrand('');
    setModel('');
    goAfter('subcategory', category, value, '');
  }

  function pickBrand(value: string) {
    setBrand(value);
    setModel('');
    goAfter('brand', category, subcategory, value);
  }

  function pickModel(value: string) {
    setModel(value);
    goAfter('model', category, subcategory, brand);
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const merged = [...files, ...picked];
    setError(
      merged.length > MAX_PHOTOS
        ? `You can add up to ${MAX_PHOTOS} photos. The first ${MAX_PHOTOS} will be used.`
        : '',
    );
    setFiles(merged.slice(0, MAX_PHOTOS));
    e.target.value = '';
  }

  function removePhoto(i: number) {
    setFiles(files.filter((_, idx) => idx !== i));
  }

  function makeCover(i: number) {
    if (i === 0) return;
    const copy = [...files];
    const [f] = copy.splice(i, 1);
    copy.unshift(f);
    setFiles(copy);
  }

  // Checks the current screen, then moves on
  function next() {
    if (step === 'photos' && files.length === 0) {
      setError('Please add at least one photo.');
      return;
    }
    if (step === 'basics') {
      if (!title.trim()) return setError('Please enter a title.');
      if (price === '' || Number(price) < 0) return setError('Please enter a price.');
      if (!description.trim()) return setError('Please write a short description.');
    }
    if (step === 'location' && !location.trim()) {
      setError('Please enter your city or area.');
      return;
    }
    if (step === 'contact') {
      if (!phone.trim()) return setError('Please enter your phone number.');
      if (!email.trim()) return setError('Please enter your contact email.');
    }
    go(steps[index + 1]);
  }

  async function publish() {
    if (!user) return;
    setBusy(true);
    setError('');

    const imageUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setStatus(`Uploading photo ${i + 1} of ${files.length}...`);
      const file = await compressImage(files[i]);
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file);

      if (uploadError) {
        setError(`Could not upload photo ${i + 1}: ${uploadError.message}`);
        setBusy(false);
        setStatus('');
        return;
      }

      const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(fileName);
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
        model: model.trim() || null,
        condition,
        region,
        location: location.trim(),
        description: description.trim(),
        specs: hasSpecs(subcategory) ? cleanSpecs(specs) : null,
        email: email.trim(),
        phone: phone.trim(),
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
        user_id: user.id,
      })
      .select('id, title')
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? 'Something went wrong saving your listing.');
      setBusy(false);
      setStatus('');
      return;
    }

    setBusy(false);
    setStatus('');
    setPublished(data as { id: number; title: string });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  async function share() {
    if (!published) return;
    const url = `${window.location.origin}/products/${listingSlug(published)}`;
    try {
      if (navigator.share) await navigator.share({ title: published.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setStatus('Link copied');
      }
    } catch {
      /* user closed the share sheet */
    }
  }
// ---------- loading / logged out ----------
  if (!ready) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-sm font-medium text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-6 sm:py-12">
        <div className="bazaa-card p-5 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amberSoft text-amberDeep">
            <span className="text-xl">+</span>
          </div>
          <h1 className="bazaa-title text-2xl">Log in to post a listing</h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use the Log in / Sign up button at the top of the page, then come back here.
          </p>
          <a href="/" className="bazaa-primary mt-6 min-h-[48px] w-full px-5 sm:w-auto">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  // ---------- published ----------
  if (published) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <div className="bazaa-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amberSoft text-2xl text-amberDeep">
            ✓
          </div>
          <h1 className="bazaa-title text-2xl">Your ad is live!</h1>
          <p className="mt-2 text-sm text-muted">{published.title}</p>
          <div className="mt-6 space-y-3">
            <Link
              href={`/products/${listingSlug(published)}`}
              className="bazaa-primary min-h-[48px] w-full px-5"
            >
              View ad
            </Link>
            <button
              type="button"
              onClick={share}
              className="min-h-[48px] w-full rounded-bazaa border-[1.5px] border-line bg-white px-5 font-bold text-ink"
            >
              {status === 'Link copied' ? 'Link copied' : 'Share'}
            </button>
            <Link
              href="/my-listings"
              className="block min-h-[48px] w-full rounded-bazaa border-[1.5px] border-line bg-white px-5 py-3 text-center font-bold text-ink"
            >
              Manage ad
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- wizard ----------
  const choiceHeading =
    step === 'brand'
      ? 'Which brand?'
      : step === 'model'
        ? `Which ${brand} model?`
        : STEP_TITLES[step];

  const summaryRows: [string, string, StepId][] = [
    ['Category', [category, subcategory].filter(Boolean).join(' › '), 'category'],
    ['Brand / model', [brand, model].filter(Boolean).join(' · '), brand ? 'brand' : 'category'],
    ['Condition', condition, 'details'],
    ['Location', [location, region].filter(Boolean).join(', '), 'location'],
    ['Contact', phone, 'contact'],
  ];

  return (
    <div className="mx-auto max-w-2xl pb-28 pt-1 sm:pt-4">
      {/* Progress + back */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-line bg-white text-2xl text-ink"
        >
          ‹
        </button>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-amber transition-all"
              style={{ width: `${((index + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-muted">
            Step {index + 1} of {steps.length}
          </div>
        </div>
      </div>

      <h1 className="bazaa-title mb-4 text-2xl leading-tight sm:text-3xl">{choiceHeading}</h1>

      {/* Category */}
      {step === 'category' && (
        <div className="bazaa-card overflow-hidden">
          {Object.entries(CATEGORY_CONFIG).map(([name, cfg]) => (
            <button key={name} type="button" onClick={() => pickCategory(name)} className={rowClass}>
              <span>
                <span className="mr-3 text-xl">{cfg.icon}</span>
                <span className={name === category ? 'font-bold text-amberDeep' : ''}>{name}</span>
              </span>
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>
      )}

      {/* Subcategory */}
      {step === 'subcategory' && (
        <div className="bazaa-card overflow-hidden">
          {subcategories.map((s) => (
            <button key={s} type="button" onClick={() => pickSubcategory(s)} className={rowClass}>
              <span className={s === subcategory ? 'font-bold text-amberDeep' : ''}>{s}</span>
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>
      )}

      {/* Brand */}
      {step === 'brand' && (
        <div className="bazaa-card overflow-hidden">
          {brands.map((b) => (
            <button key={b} type="button" onClick={() => pickBrand(b)} className={rowClass}>
              <span className={b === brand ? 'font-bold text-amberDeep' : ''}>{b}</span>
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>
      )}

      {/* Model */}
      {step === 'model' && (
        <div className="bazaa-card overflow-hidden">
          {modelList.map((m) => (
            <button key={m} type="button" onClick={() => pickModel(m)} className={rowClass}>
              <span className={m === model ? 'font-bold text-amberDeep' : ''}>{m}</span>
              {m === model ? <span className="text-amberDeep">✓</span> : <span className="text-muted">›</span>}
            </button>
          ))}
        </div>
      )}

      {/* Photos */}
      {step === 'photos' && (
        <div className="bazaa-card p-4 sm:p-6">
          <p className="mb-4 text-sm leading-5 text-muted">
            Add up to {MAX_PHOTOS} clear photos. Tap “Make cover” to choose the main photo.
          </p>

          {previews.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previews.map((src, i) => (
                <div key={src} className="overflow-hidden rounded-bazaa border-[1.5px] border-line bg-white">
                  <div className="relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-amber px-2 py-0.5 text-xs font-bold text-ink">
                        Cover
                      </span>
                    )}
                  </div>
                  <div className="flex border-t border-line text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => makeCover(i)}
                      disabled={i === 0}
                      className="min-h-[40px] flex-1 text-ink disabled:text-mutedLight"
                    >
                      Make cover
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="min-h-[40px] flex-1 border-l border-line text-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {files.length < MAX_PHOTOS && (
            <label
              htmlFor="listing-photos"
              className="flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-bazaa border-[1.5px] border-dashed border-line bg-paper px-4 py-6 text-center active:bg-amberSoft"
            >
              <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amberSoft text-2xl font-bold text-amberDeep">
                +
              </span>
              <span className="font-bold text-ink">{files.length ? 'Add more photos' : 'Add photos'}</span>
              <input
                id="listing-photos"
                type="file"
                accept="image/*"
                multiple
                onChange={onFilesChange}
                className="sr-only"
              />
            </label>
          )}
        </div>
      )}

      {/* Details */}
      {step === 'details' && (
        <div className="bazaa-card p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="listing-condition" className={labelClass}>
                Condition
              </label>
              <select
                id="listing-condition"
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

            {subcategory && brand && modelList.length === 0 && (
              <div>
                <label htmlFor="listing-model" className={labelClass}>
                  Model (optional)
                </label>
                <input
                  id="listing-model"
                  className={inputClass}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Model name"
                />
              </div>
            )}
          </div>

          {hasSpecs(subcategory) && <SpecsEditor rows={specs} onChange={setSpecs} />}
        </div>
      )}

      {/* Title, price, description */}
      {step === 'basics' && (
        <div className="bazaa-card p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="listing-title" className={labelClass}>
                Title
              </label>
              <input
                id="listing-title"
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  [brand, model].filter(Boolean).join(' ') || 'e.g. iPhone 13 Pro, 128GB'
                }
              />
            </div>
            <div>
              <label htmlFor="listing-price" className={labelClass}>
                Price (ETB)
              </label>
              <input
                id="listing-price"
                className={inputClass}
                type="number"
                inputMode="numeric"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 45000"
              />
            </div>
            <div>
              <label htmlFor="listing-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="listing-description"
                className={`${inputClass} min-h-[140px] resize-y`}
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Condition, details, why you're selling..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Location */}
      {step === 'location' && (
        <div className="bazaa-card p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="listing-region" className={labelClass}>
                Region
              </label>
              <select
                id="listing-region"
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
              <label htmlFor="listing-location" className={labelClass}>
                City / area
              </label>
              <input
                id="listing-location"
                className={inputClass}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Jimma, Sefer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact */}
      {step === 'contact' && (
        <div className="bazaa-card p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="listing-phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="listing-phone"
                className={inputClass}
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0911 234 567"
              />
            </div>
            <div>
              <label htmlFor="listing-email" className={labelClass}>
                Contact email
              </label>
              <input
                id="listing-email"
                className={inputClass}
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="bazaa-card overflow-hidden">
            {previews[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previews[0]} alt="" className="aspect-[4/3] w-full object-cover" />
            )}
            {previews.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {previews.slice(1).map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" className="h-16 w-16 shrink-0 rounded object-cover" />
                ))}
              </div>
            )}
            <div className="p-4 sm:p-6">
              <div className="font-serif text-2xl font-bold text-amberDeep">
                ETB {Number(price || 0).toLocaleString()}
              </div>
              <div className="mt-1 text-lg font-bold text-ink">{title}</div>
              <div className="mt-1 text-sm text-muted">
                {[brand, model].filter(Boolean).join(' · ')}
                {brand || model ? ' · ' : ''}
                {location}, {region}
              </div>

              {hasSpecs(subcategory) && cleanSpecs(specs) && (
                <div className="mt-4 overflow-hidden rounded-bazaa border-[1.5px] border-line">
                  {cleanSpecs(specs)!.map((r) => (
                    <div key={r.label} className="flex justify-between border-b border-line px-3 py-2 text-sm last:border-b-0">
                      <span className="text-muted">{r.label}</span>
                      <span className="font-semibold text-ink">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-ink">{description}</p>
            </div>
          </div>

          <div className="bazaa-card overflow-hidden">
            {summaryRows.map(([label, value, target]) => (
              <button
                key={label}
                type="button"
                onClick={() => go(target)}
                className="flex w-full items-center justify-between border-b border-line px-4 py-3 text-left last:border-b-0"
              >
                <span>
                  <span className="block text-xs text-muted">{label}</span>
                  <span className="block text-sm font-semibold text-ink">{value || '—'}</span>
                </span>
                <span className="text-sm font-bold text-amberDeep">Edit</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => go('photos')}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold text-ink">{files.length} photo(s)</span>
              <span className="text-sm font-bold text-amberDeep">Edit</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => go('basics')}
            className="w-full text-center text-sm font-bold text-amberDeep"
          >
            Edit title, price or description
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-bazaa border-[1.5px] border-danger/25 bg-dangerSoft p-4 text-sm font-medium leading-5 text-danger">
          {error}
        </div>
      )}

      {busy && status && (
        <div aria-live="polite" className="mt-4 rounded-bazaa border-[1.5px] border-line bg-white p-4 text-sm font-medium text-muted">
          {status}
        </div>
      )}

      {/* Continue / Publish (steps that pick from a list move on by themselves) */}
      {['photos', 'details', 'basics', 'location', 'contact', 'preview'].includes(step) && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-2xl">
            {step === 'preview' ? (
              <button
                type="button"
                onClick={publish}
                disabled={busy}
                className="bazaa-primary min-h-[52px] w-full px-5 py-3.5 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? status || 'Working...' : 'Publish'}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="bazaa-primary min-h-[52px] w-full px-5 py-3.5 text-base font-bold"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}