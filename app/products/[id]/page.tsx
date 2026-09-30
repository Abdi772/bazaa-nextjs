 'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { CATEGORY_CONFIG, ETHIOPIA_REGIONS, CONDITIONS } from '../../../lib/categories';
import { listingSlug } from '../../../lib/listings';

const MAX_PHOTOS = 5;

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-base bg-white focus:outline-none focus:border-ink';
const labelClass = 'block text-sm font-medium mb-1';

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState('');

  const [existing, setExisting] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      const { data: l, error: loadError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (loadError || !l) {
        setBlocked('Listing not found.');
      } else if (!user || l.user_id !== user.id) {
        setBlocked('You can only edit your own listings.');
      } else {
        setTitle(l.title ?? '');
        setPrice(String(l.price ?? ''));
        setCategory(l.category ?? 'Electronics');
        setSubcategory(l.subcategory ?? '');
        setBrand(l.brand ?? '');
        setCondition(l.condition ?? CONDITIONS[0]);
        setRegion(l.region ?? ETHIOPIA_REGIONS[0]);
        setLocation(l.location ?? '');
        setDescription(l.description ?? '');
        setPhone(l.phone ?? '');
        setEmail(l.email ?? '');
        setExisting(l.image_urls?.length ? l.image_urls : l.image_url ? [l.image_url] : []);
      }
      setLoaded(true);
    }
    load();
  }, [id]);

  const subcategories = Object.keys(CATEGORY_CONFIG[category]?.subcategories ?? {});
  const brands = subcategory ? CATEGORY_CONFIG[category]?.subcategories[subcategory] ?? [] : [];

  function onCategoryChange(value: string) {
    setCategory(value);
    setSubcategory('');
    setBrand('');
  }

  function onSubcategoryChange(value: string) {
    setSubcategory(value);
    setBrand('');
  }

  function removeExisting(index: number) {
    setExisting(existing.filter((_, i) => i !== index));
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const room = MAX_PHOTOS - existing.length;
    if (picked.length > room) {
      setError(`You can have up to ${MAX_PHOTOS} photos in total.`);
    } else {
      setError('');
    }
    setFiles(picked.slice(0, Math.max(room, 0)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');

    const imageUrls: string[] = [...existing];
    for (let i = 0; i < files.length; i++) {
      setStatus(`Uploading photo ${i + 1} of ${files.length}...`);
      const file = files[i];
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

    setStatus('Saving...');
    const { data, error: updateError } = await supabase
      .from('listings')
      .update({
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
      })
      .eq('id', id)
      .select('id, title')
      .single();

    if (updateError || !data) {
      setError(updateError?.message ?? 'Could not save your changes.');
      setBusy(false);
      setStatus('');
      return;
    }

    router.push(`/products/${listingSlug(data)}`);
  }

  if (!loaded) {
    return <p className="py-10 text-center text-gray-500">Loading...</p>;
  }

  if (blocked) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-semibold mb-2">{blocked}</h1>
        <a href="/" className="text-ink underline">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-4">
      <h1 className="text-2xl font-semibold mb-4">Edit listing</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Photos (up to {MAX_PHOTOS})</label>
          {existing.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {existing.map((url, i) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeExisting(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-sm leading-6"
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {existing.length < MAX_PHOTOS && (
            <input type="file" accept="image/*" multiple onChange={onFilesChange} className="w-full text-sm" />
          )}
          {files.length > 0 && <p className="text-xs text-gray-500 mt-1">{files.length} new photo(s) selected</p>}
        </div>

        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Price (ETB)</label>
          <input className={inputClass} type="number" inputMode="numeric" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            {Object.keys(CATEGORY_CONFIG).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {subcategories.length > 0 && (
          <div>
            <label className={labelClass}>Subcategory</label>
            <select className={inputClass} required value={subcategory} onChange={(e) => onSubcategoryChange(e.target.value)}>
              <option value="">Select...</option>
              {subcategories.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {brands.length > 0 && (
          <div>
            <label className={labelClass}>Brand</label>
            <select className={inputClass} required value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Select...</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelClass}>Condition</label>
          <select className={inputClass} value={condition} onChange={(e) => setCondition(e.target.value)}>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Region</label>
          <select className={inputClass} value={region} onChange={(e) => setRegion(e.target.value)}>
            {ETHIOPIA_REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Location (city/area)</label>
          <input className={inputClass} required value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea className={inputClass} rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Phone number</label>
          <input className={inputClass} type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div>
          <label className={labelClass}>Contact email</label>
          <input className={inputClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-amber text-ink font-semibold rounded-lg py-3 disabled:opacity-60"
        >
          {busy ? status || 'Working...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
                  }
