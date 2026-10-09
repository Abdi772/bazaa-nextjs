 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { modelsFor } from '../../../lib/models';
import { supabase } from '../../../lib/supabaseClient';
import {
  CATEGORY_CONFIG,
  ETHIOPIA_REGIONS,
  CONDITIONS,
  getOtherBrands,
} from '../../../lib/categories';
import { listingSlug } from '../../../lib/listings';
import { compressImage } from '../../../lib/compressImage';

const MAX_PHOTOS = 5;

const inputClass =
  'w-full min-h-[48px] rounded-bazaa border-[1.5px] border-line bg-white px-4 py-3 text-base text-ink placeholder:text-mutedLight transition-colors focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:cursor-not-allowed disabled:bg-surfaceSoft disabled:text-muted';

const labelClass =
  'mb-1.5 block text-sm font-bold text-ink';

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
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [trim, setTrim] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sizeSqm, setSizeSqm] = useState('');
  const [furnished, setFurnished] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [modelSearch, setModelSearch] = useState('');
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
    let cancelled = false;

    async function load() {
      setLoaded(false);
      setBlocked('');
      setError('');

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        if (!cancelled) {
          setBlocked('Please log in to edit this listing.');
          setLoaded(true);
        }
        return;
      }

      const { data: listing, error: loadError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (cancelled) return;

      if (loadError || !listing) {
        setBlocked('Listing not found.');
        setLoaded(true);
        return;
      }

      if (listing.user_id !== user.id) {
        setBlocked('You can only edit your own listings.');
        setLoaded(true);
        return;
      }

      setTitle(listing.title ?? '');
      setPrice(String(listing.price ?? ''));
      setCategory(listing.category ?? 'Electronics');
      setSubcategory(listing.subcategory ?? '');
      setBrand(listing.brand ?? '');
      setModel(listing.model ?? '');
      setYear(listing.year ? String(listing.year) : '');
      setTrim(listing.trim ?? '');
      setModelNumber(listing.model_number ?? '');
      setBedrooms(listing.bedrooms != null ? String(listing.bedrooms) : '');
      setBathrooms(listing.bathrooms != null ? String(listing.bathrooms) : '');
      setSizeSqm(listing.size_sqm != null ? String(listing.size_sqm) : '');
      setFurnished(listing.furnished ?? '');
      setCondition(listing.condition ?? CONDITIONS[0]);
      setRegion(listing.region ?? ETHIOPIA_REGIONS[0]);
      setLocation(listing.location ?? '');
      setDescription(listing.description ?? '');
      setPhone(listing.phone ?? '');
      setEmail(listing.email ?? '');

      const savedImages =
        Array.isArray(listing.image_urls) &&
        listing.image_urls.length > 0
          ? listing.image_urls
          : listing.image_url
            ? [listing.image_url]
            : [];

      setExisting(savedImages);
      setFiles([]);
      setLoaded(true);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const subcategories = Object.keys(
    CATEGORY_CONFIG[category]?.subcategories ?? {},
  );

  const mainBrands = subcategory
    ? CATEGORY_CONFIG[category]?.subcategories[subcategory] ?? []
    : [];

  // Main brands first, then the brands that sit under "Other"
  const extraBrands = subcategory ? getOtherBrands(subcategory) : [];

  const baseBrands =
    extraBrands.length > 0
      ? Array.from(
          new Set([
            ...mainBrands.filter((b) => b !== 'Other'),
            ...extraBrands.filter((b) => b !== 'Other'),
            'Other',
          ]),
        )
      : mainBrands;

  // Keep the ad's current brand selectable even if it is not in the list
  const brands =
    brand && baseBrands.length > 0 && !baseBrands.includes(brand)
      ? [brand, ...baseBrands]
      : baseBrands;

  // Vehicles also get Year and Trim
  const isVehicle =
    category === 'Vehicles' ||
    [
    'Cars',
    'Pickup Trucks',
    'Vans & Minivans',
    'Minibuses',
    'Buses',
    'Trucks',
    'Motorcycles',
    'Three-Wheelers',
  ].includes(subcategory);

  // Property fields
  const isHome =
    subcategory === 'For Rent' || subcategory === 'For Sale';
  const showSize =
    isHome ||
    subcategory === 'Land' ||
    subcategory === 'Commercial';

  const yearOptions = Array.from(
    { length: new Date().getFullYear() + 1 - 1979 },
    (_, i) => String(new Date().getFullYear() + 1 - i),
  );

  const brandLabel = [
      'Accessories',
      'Phone Accessories',
      'Audio',
      'Networking',
      'Security & CCTV',
    ].includes(subcategory)
      ? 'Type'
      : 'Brand';

  const modelLabel =
    subcategory === 'TV'
      ? 'Size'
      : subcategory === 'Refrigerators & Freezers'
        ? 'Type'
        : 'Model';

  // Model number is shown for Electronics (phones, laptops, appliances...)
  const showModelNumber =
    !!subcategory &&
    category === 'Electronics' &&
    modelLabel === 'Model';

  const modelList = modelsFor(subcategory, brand);

  const shownModels = (() => {
    const clean = (v: string) =>
      v.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const q = clean(modelSearch);

    if (!q) return modelList;

    return modelList.filter((m) => m === model || clean(m).includes(q));
  })();

  const manualLabel =
    modelLabel === 'Model' ? 'Model name' : modelLabel;

  function onCustomModelChange(value: string) {
    setCustomModel(value);

  }

  // Show the manual box for "Other" and for ads whose model is not in the list
  const showManual =
    modelList.length > 0 &&
    (model === 'Other' ||
      (!!model && !modelList.includes(model)));

  function onCategoryChange(value: string) {
    setCategory(value);
    setSubcategory('');
    setBrand('');
    setModel('');
    setError('');
  }

  function onSubcategoryChange(value: string) {
    setSubcategory(value);
    setBedrooms('');
    setBathrooms('');
    setSizeSqm('');
    setFurnished('');
    setBrand('');
    setModel('');
    setCustomModel('');
    setModelNumber('');
    setModelSearch('');
    setError('');
  }

  function onBrandChange(value: string) {
    setBrand(value);
    setModel('');
    setCustomModel('');
    setModelNumber('');
    setModelSearch('');
    setError('');
  }

  function removeExisting(index: number) {
    setExisting((current) => current.filter((_, i) => i !== index));
    setError('');
  }

  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    const room = Math.max(MAX_PHOTOS - existing.length, 0);

    if (picked.length > room) {
      setError(`You can have up to ${MAX_PHOTOS} photos in total.`);
    } else {
      setError('');
    }

    setFiles(picked.slice(0, room));
    event.target.value = '';
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    setError('');
    setStatus('');

    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const numericPrice = Number(price);

    if (!trimmedTitle) {
      setError('Please enter a title.');
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError('Please enter a valid price.');
      return;
    }

        if (!subcategory && subcategories.length > 0) {
      setError('Please select a subcategory.');
      return;
    }

    if (!brand && brands.length > 0) {
      setError('Please select a brand.');
      return;
    }

    if (!trimmedLocation) {
      setError('Please enter the location.');
      return;
    }

    if (!trimmedDescription) {
      setError('Please enter a description.');
      return;
    }

    if (!trimmedPhone) {
      setError('Please enter a phone number.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter a contact email.');
      return;
    }

    const totalPhotos = existing.length + files.length;

    if (totalPhotos > MAX_PHOTOS) {
      setError(`You can have up to ${MAX_PHOTOS} photos in total.`);
      return;
    }

    setBusy(true);

    try {
      const imageUrls: string[] = [...existing];

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
          setError(
            `Could not upload photo ${i + 1}: ${uploadError.message}`,
          );
          setStatus('');
          setBusy(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }

      setStatus('Saving changes...');

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setError('Your session has expired. Please log in again.');
        setStatus('');
        setBusy(false);
        return;
      }

      const { data, error: updateError } = await supabase
        .from('listings')
        .update({
          title: trimmedTitle,
          price: numericPrice,
          category,
          subcategory: subcategory || null,
          brand: brand || null,
          model:
            (model === 'Other' && customModel.trim()
              ? customModel.trim()
              : model.trim()) || null,
          model_number:
            (showModelNumber ? modelNumber.trim() : '') || null,
          model_custom:
            showManual &&
            (model !== 'Other' || !!customModel.trim()),
          year: isVehicle && year ? Number(year) : null,
          trim: isVehicle && trim.trim() ? trim.trim() : null,
          bedrooms: isHome && bedrooms ? Number(bedrooms) : null,
          bathrooms: isHome && bathrooms ? Number(bathrooms) : null,
          size_sqm: showSize && sizeSqm ? Number(sizeSqm) : null,
          furnished: isHome && furnished ? furnished : null,
          condition,
          region,
          location: trimmedLocation,
          description: trimmedDescription,
          email: trimmedEmail,
          phone: trimmedPhone,
          image_url: imageUrls[0] ?? null,
          image_urls: imageUrls,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select('id, title')
        .single();

      if (updateError || !data) {
        setError(updateError?.message ?? 'Could not save your changes.');
        setStatus('');
        setBusy(false);
        return;
      }

      setStatus('Saved.');
      router.push(`/products/${listingSlug(data)}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Something went wrong while saving.',
      );
      setStatus('');
      setBusy(false);
    }
  }

  if (!loaded) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="bazaa-card p-6 text-center">
          <div
            className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amberSoft text-xl"
            aria-hidden="true"
          >
            ✏️
          </div>
          <p className="text-sm font-semibold text-muted">
            Loading listing...
          </p>
        </div>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="bazaa-card p-5 sm:p-7">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-dangerSoft text-xl"
            aria-hidden="true"
          >
            !
          </div>

          <h1 className="bazaa-title text-2xl">{blocked}</h1>

          <p className="mt-2 text-sm font-medium text-muted">
            You can return to the marketplace and continue browsing listings.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="bazaa-primary min-h-[48px] w-full sm:w-auto"
            >
              Back to marketplace
            </Link>

            <Link
              href="/my-listings"
              className="bazaa-secondary min-h-[48px] w-full sm:w-auto"
            >
              My listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <Link
          href="/my-listings"
          className="inline-flex min-h-[40px] items-center text-sm font-bold text-amberDeep hover:text-amber"
        >
          ← My listings
        </Link>

        <h1 className="bazaa-title mt-2 text-2xl sm:text-3xl">
          Edit listing
        </h1>

        <p className="mt-1 text-sm font-medium text-muted">
          Update your listing details and save your changes.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <section className="bazaa-card p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-ink">Photos</h2>
            <p className="mt-1 text-sm font-medium text-muted">
              Keep up to {MAX_PHOTOS} photos.
            </p>
          </div>

          {existing.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {existing.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative overflow-hidden rounded-bazaa border-[1.5px] border-line bg-paper"
                >
{/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Listing photo ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeExisting(index)}
                    className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-danger bg-white/95 text-lg font-bold text-danger shadow-soft backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
                    aria-label={`Remove photo ${index + 1}`}
                    title="Remove photo"
                  >
                    ×
                  </button>

                  <span className="absolute bottom-2 left-2 rounded-full bg-ink/75 px-2 py-1 text-[11px] font-bold text-paper">
                    Photo {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {existing.length < MAX_PHOTOS && (
            <label
              htmlFor="edit-photos"
              className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-bazaa border-[1.5px] border-dashed border-line bg-surfaceSoft px-4 py-6 text-center transition-colors hover:border-amber hover:bg-amberSoft/40"
            >
              <span
                className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-amberSoft text-xl"
                aria-hidden="true"
              >
                📷
              </span>

              <span className="text-sm font-bold text-ink">
                Add more photos
              </span>

              <span className="mt-1 text-xs font-medium text-muted">
                {MAX_PHOTOS - existing.length}{' '}
                {MAX_PHOTOS - existing.length === 1 ? 'spot' : 'spots'} remaining
              </span>

              <input
                id="edit-photos"
                type="file"
                accept="image/*"
                multiple
                onChange={onFilesChange}
                className="sr-only"
                disabled={busy}
              />
            </label>
          )}

          {files.length > 0 && (
            <div className="mt-3 rounded-bazaa border border-line bg-amberSoft p-3 text-sm font-semibold text-ink">
              {files.length} {files.length === 1 ? 'new photo' : 'new photos'} selected.
            </div>
          )}
        </section>

        <section className="bazaa-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-bold text-ink">
            Listing details
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className={labelClass}>
                Title
              </label>
              <input
                id="edit-title"
                className={inputClass}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling?"
                autoComplete="off"
                disabled={busy}
              />
            </div>

            <div>
              <label htmlFor="edit-price" className={labelClass}>
                Price (ETB)
              </label>
              <input
                id="edit-price"
                className={inputClass}
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                disabled={busy}
              />
            </div>

            <div>
              <label htmlFor="edit-category" className={labelClass}>
                Category
              </label>
              <select
                id="edit-category"
                className={inputClass}
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                disabled={busy}
              >
                {Object.keys(CATEGORY_CONFIG).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                   </select>
            </div>

            {subcategories.length > 0 && (
              <div>
                <label htmlFor="edit-subcategory" className={labelClass}>
                  Subcategory
                </label>
                <select
                  id="edit-subcategory"
                  className={inputClass}
                  required
                  value={subcategory}
                  onChange={(e) => onSubcategoryChange(e.target.value)}
                  disabled={busy}
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {brands.length > 0 && (
              <div>
                <label htmlFor="edit-brand" className={labelClass}>
                  {brandLabel}
                </label>
                <select
                  id="edit-brand"
                  className={inputClass}
                  required
                  value={brand}
                  onChange={(e) => onBrandChange(e.target.value)}
       disabled={busy}
                >
                  <option value="">Select {brandLabel.toLowerCase()}</option>
                  {brands.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {subcategory && category !== 'Property' && (
              <div>
                <label htmlFor="edit-model" className={labelClass}>
                  {modelLabel}
                </label>

                {modelList.length > 0 ? (
                  <>
                    {modelList.length > 15 && (
                      <input
                        type="search"
                        className={`${inputClass} mb-2`}
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        placeholder={`Search ${modelLabel.toLowerCase()}...`}
                        disabled={busy}
                      />
                    )}

                    <select
                      id="edit-model"
                      className={inputClass}
                      value={model}
                      onChange={(e) => {
                        setModel(e.target.value);
                        setCustomModel('');
      setModelNumber('');
                      }}
                      disabled={busy}
                    >
                      <option value="">
                        Select {modelLabel.toLowerCase()}...
                      </option>
                      {model && !modelList.includes(model) && (
                        <option value={model}>{model}</option>
                      )}
                      {shownModels.map((m) => (
                        <option key={m} value={m}>
                          {m === 'Other'
                            ? `Can't find my ${modelLabel.toLowerCase()} - enter it manually`
                            : m}
                        </option>
                      ))}
                    </select>

                    {showManual && model === 'Other' && (
                      <div className="mt-2 rounded-bazaa border border-line bg-surfaceSoft p-3">
                        <p className="mb-2 text-sm font-semibold text-ink">
                          Can't find your {modelLabel.toLowerCase()}? Enter it here.
                        </p>
                        {model === 'Other' && (
                          <>
                        <label className={labelClass}>
                          {manualLabel}
                        </label>
                        <input
                          required
                          className={inputClass}
                          value={customModel}
                          onChange={(e) => onCustomModelChange(e.target.value)}
                          placeholder="Type it here"
                        disabled={busy}
                        />
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <input
                    id="edit-model"
                    className={inputClass}
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Model name (optional)"
                    autoComplete="off"
                    disabled={busy}
                  />
                )}
              </div>
            )}

            {showModelNumber && (
              <div>
                <label htmlFor="edit-model-number" className={labelClass}>
                  Model number
                </label>
                <input
                  id="edit-model-number"
                  className={inputClass}
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="e.g. SM-A576B (optional)"
                  autoComplete="off"
                  disabled={busy}
                />
              </div>
            )}

            {isHome && (
              <>
                <div>
                  <label htmlFor="edit-bedrooms" className={labelClass}>
                    Bedrooms
                  </label>
                  <input
                    id="edit-bedrooms"
                    className={inputClass}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    disabled={busy}
                    placeholder="e.g. 3 (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="edit-bathrooms" className={labelClass}>
                    Bathrooms
                  </label>
                  <input
                    id="edit-bathrooms"
                    className={inputClass}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    disabled={busy}
                    placeholder="e.g. 2 (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="edit-furnished" className={labelClass}>
                    Furnished
                  </label>
                  <select
                    id="edit-furnished"
                    className={inputClass}
                    value={furnished}
                    onChange={(e) => setFurnished(e.target.value)}
                    disabled={busy}
                  >
                    <option value="">Select (optional)</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-furnished">Semi-furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </>
            )}

            {showSize && (
              <div>
                <label htmlFor="edit-size" className={labelClass}>
                  Size (m²)
                </label>
                <input
                  id="edit-size"
                  className={inputClass}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={sizeSqm}
                  onChange={(e) => setSizeSqm(e.target.value)}
                    disabled={busy}
                  placeholder="e.g. 120 (optional)"
                />
              </div>
            )}

            {isVehicle && (
              <>
                <div>
                  <label htmlFor="edit-year" className={labelClass}>
                    Year
                  </label>
                  <select
                    id="edit-year"
                    className={inputClass}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={busy}
                  >
                    <option value="">Select year (optional)</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-trim" className={labelClass}>
                    Trim / Variant
                  </label>
                  <input
                    id="edit-trim"
                    className={inputClass}
                    value={trim}
                    onChange={(e) => setTrim(e.target.value)}
                    placeholder="e.g. XLi, GLS, 4x4 (optional)"
                    autoComplete="off"
                    disabled={busy}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="edit-condition" className={labelClass}>
                Condition
              </label>
              <select
                id="edit-condition"
                className={inputClass}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                disabled={busy}
              >
                {CONDITIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
        <section className="bazaa-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-bold text-ink">Location</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="edit-region" className={labelClass}>
                Region
              </label>
              <select
                id="edit-region"
                className={inputClass}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                disabled={busy}
              >
                {ETHIOPIA_REGIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                                     </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-location" className={labelClass}>
                Location (city/area)
              </label>
              <input
                id="edit-location"
                className={inputClass}
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bole, Addis Ababa"
                autoComplete="address-level2"
                disabled={busy}
              />
            </div>
          </div>
        </section>

        <section className="bazaa-card p-4 sm:p-6">
          <label htmlFor="edit-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="edit-description"
            className={`${inputClass} min-h-[140px] resize-y`}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item, condition, and anything buyers should know."
            disabled={busy}
          />
        </section>

        <section className="bazaa-card p-4 sm:p-6">
          <h2 className="mb-4 text-base font-bold text-ink">
            Contact details
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="edit-phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="edit-phone"
                className={inputClass}
                type="tel"
                inputMode="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09..."
                autoComplete="tel"
                disabled={busy}
              />
            </div>

            <div>
              <label htmlFor="edit-email" className={labelClass}>
                Contact email
              </label>
              <input
                id="edit-email"
                className={inputClass}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={busy}
              />
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-bazaa border-[1.5px] border-danger/30 bg-dangerSoft p-3.5 text-sm font-semibold text-danger"
          >
            {error}
          </div>
        )}

        {status && !error && (
          <div
            aria-live="polite"
            className="rounded-bazaa border-[1.5px] border-amber/30 bg-amberSoft p-3.5 text-sm font-semibold text-ink"
          >
            {status}
          </div>
        )}

        <div className="flex flex-col gap-2 pb-4 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={busy}
            className="bazaa-primary min-h-[52px] w-full border-[1.5px] border-amberDeep font-bold disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
          >
            {busy ? status || 'Saving...' : 'Save changes'}
          </button>

          <Link
            href="/my-listings"
            className="bazaa-secondary min-h-[52px] w-full sm:flex-1"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}



                             
